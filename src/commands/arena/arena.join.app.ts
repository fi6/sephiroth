import { AppCommand, AppCommandFunc } from 'kbotify';
import Arena from 'models/Arena';
import { arenaLeave } from './arena.leave.app';
import { ArenaSession } from './arena.types';
import { arenaCheckMember } from './shared/arena.check-member';
import { arenaGetValid } from './shared/arena.get-valid';
import { updateArenaList } from './shared/arena.update-list';

class ArenaJoin extends AppCommand {
    trigger = '加入';

    help = '仅可通过按钮加入';
    func: AppCommandFunc<ArenaSession> = async (session: ArenaSession) => {
        const [msg, args] = [session.msg, session.args as string[]];

        // if (msg.mention.user.length != 1) {
        //     session.reply(this.help);
        // }
        session.arena = await Arena.findOne({
            _id: session.args[0],
        }).exec();
        if (!session.arena) return session.sendTemp('没有找到对应房间。');

        if (session.arena.member?.length) {
            for (const user of session.arena.member) {
                if (user._id == session.userId) {
                    return session.replyTemp(
                        '你已经在此房间中，房间密码为' +
                            session.arena.password +
                            '\n如需更换房间请输入`.房间 退出`。'
                    );
                }
            }
        }
        let leaveMessage = '';
        session.arenas = await arenaGetValid();
        session.arenas.forEach((arena) => {
            if (arenaCheckMember(arena, session.userId)) {
                arenaLeave.leave(arena, session.userId);
                leaveMessage = `已退出${arena.nickname}的房间。`;
            }
        });
        console.log('queue:', session.arena.member);
        if (!session.arena.member) {
            session.arena.member = [];
        }
        session.arena.member.push({
            _id: session.user.id,
            nickname: session.user.username,
        });
        session.arena.isNew = false;
        session.arena.markModified('member');
        await session.arena.save();
        const arena = session.arena;
        updateArenaList();
        return session.mentionTemp(
            ''.concat(
                leaveMessage,
                `\n欢迎加入${arena.nickname}的房间！`,
                `\n房间号：${arena.code}，房间密码：${session.arena.password}`
            )
        );
    };
}

export const arenaJoin = new ArenaJoin();
