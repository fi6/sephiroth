import { AppCommand, BaseSession, GuildSession } from 'kbotify';
import { FuncResult, ResultTypes } from 'kbotify';
import Arena, { ArenaDoc } from 'models/Arena';
import { ArenaSession } from './arena.types';
import { arenaManageCard } from './card/arena.manage.card';
import { updateArenaTitle } from './shared/arena.update-list';

class ArenaManage extends AppCommand {
    code = 'manage';
    trigger = '管理';
    help = '你可以更新房间信息，或关闭房间。发送`.关房`可快速关闭房间。';
    intro = '';
    func = async (s: BaseSession) => {
        const arena = await Arena.findById(s.user.id).exec();
        if (!arena) {
            return s.replyTemp(
                `未找到你的有效房间……如需创建房间，可发送\`.建房\``
            );
        }
        const session = GuildSession.fromSession(s);
        if (session.args[0] == '关闭') {
            return this.close(session, arena);
        }
        else if (session.args[0] == '更新') {
            return this.update(session, arena);
        }
        return s.sendCardTemp(JSON.stringify(arenaManageCard(session)));
    };

    private update = async (session: GuildSession, arena: ArenaDoc) => {};

    private close = async (
        session: GuildSession,
        arena: ArenaDoc | undefined
    ) => {
        try {
            if (!arena) {
                return session.reply(`未找到可删除的房间。`);
            }
            await Arena.findByIdAndDelete(session.user.id).exec();
            updateArenaTitle();
            return session.reply(`房间\`${arena.code}\`已关闭。`);
        } catch (e) {
            console.error('Error when deleting arena', e, session);
            // data.result_status = ArenaResultStatus.error;
            // data.result.details = e;
            return session.reply(
                `关闭房间时发生未知错误。请联系作者改bug(ಥ_ಥ)\n${e}`
            );
        }
    };
}

export const arenaManage = new ArenaManage();
