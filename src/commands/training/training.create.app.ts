import { AppCommand, AppFunc, BaseSession, Card, GuildSession } from 'kbotify';

import { checkRoles } from './shared/training.checkroles';

import { parseCard } from '../../utils/card-parser';
import configs, { channels, roles } from '../../configs';

import TrainingArena, { TrainingArenaDoc } from '../../models/TrainingArena';
import { formatTime } from '../../utils/format-time';
import { trainingInfoCard } from './card/training.info.card';
import { log } from '../../init/logger';
import { createHelpCard } from '../arena/card/arena.create.card';
import Arena from '../../models/Arena';
import { createTrainingHelpCard } from './card/training.create.card';
import arenaConfig from '../../configs/arena';
import { arenaCreate } from '../arena/arena.create.app';

class TrainingCreate extends AppCommand {
    code = 'create';
    trigger = '创建';
    help =
        '创建教练房命令格式：\n`.教练房 创建 开始时间 连接方式 人数限制 留言`\n开始时间请用`小时：分钟`表示，如需其他日期请提前联系冰飞修改。\n如：`.房间 特训 18:00 裸连 5人 今天新手专场`';
    func: AppFunc<BaseSession> = async (s: BaseSession) => {
        const session = await GuildSession.fromSession(s, true);
        // console.log('receive create training', session);
        //.教练房 创建 76VR2 147 裸连 5 随意
        // error handling
        if (!checkRoles((await session.user.full()).roles, 'coach')) {
            return session.replyTemp('权限不足，只有教练组可以发起特训房。');
        }
        try {
            if (!session.args.length)
                session.args = await this.helpCreate(session);
        } catch (error) {
            log.error(error);
            return session.updateMessageTemp(arenaConfig.mainCardId, [
                new Card().addText(error.message),
            ]);
        }

        return await this.create(session);
    };

    async helpCreate(session: GuildSession): Promise<string[]> {
        const oldArena = await Arena.findById(session.user.id).exec();
        // await session.updateMessageTemp(configs.arena.mainCardId, [
        //     new Card()
        //         .addText(
        //             '请输入预计的开始时间(24小时制)\n格式为`小时:分钟`，如：`21:15`'
        //         )
        //         .addCountdown('second', new Date().valueOf() + 6e4),
        // ]);
        await session.user.grantRole(roles.tempInput);
        try {
            // let input = await session.awaitMessage(/.+/, 6e4);
            // if (!input) throw new Error('未收到开始时间输入，请重试');
            // await input.delete();
            // if (!/\d\d[:：]\d\d/.test(input.content))
            //     throw new Error('开始时间格式错误，请重试');
            await session.updateMessageTemp(configs.arena.mainCardId, [
                createTrainingHelpCard(oldArena),
            ]);
            let input = await session.awaitMessage(/.+/, 6e4);
            if (!input) throw new Error('未收到房间信息输入，请重试');
            await input.delete();
            return input.content.split(/ +/);
        } catch (e) {
            await session.user.revokeRole(roles.tempInput);
            log.info(e);
            throw e;
        }
    }

    async create(session: GuildSession) {
        if (!(session.args.length === 4))
            throw new Error(`参数有误 ${session.args}`);

        try {
            arenaCreate.argsChecker(session.args);
        } catch (error) {
            return await session.sendTemp(error.message);
        }
        const [code, password, info, remark] = session.args;

        return TrainingArena.findByIdAndUpdate(
            session.userId,
            {
                nickname: session.user.nickname,
                avatar: session.user.avatar,
                limit: parseInt(/\d/.exec(info)![0]),
                code: code,
                password: password,
                queue: [],
                info: info,
                remark: remark,
                startAt: new Date(),
                createdAt: new Date(),
                register: true,
            },
            {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true,
            }
        ).exec();
    }
}

export const trainingCreate = new TrainingCreate();

function parseTime(str: string) {
    const time = str.split(/[:：]/);
    const date = new Date();
    date.setHours(parseInt(time[0]));
    date.setMinutes(parseInt(time[1]));
    return date;
}
