import { AppCommand, AppFunc } from 'kbotify';
import { ProfileDoc } from '../../models/Profile';
import { ProfileSession } from './profile.types';
import { profileGetorCreate } from './shared/profile.get';
import { profileGetBySession } from './shared/profile.get-by-session';

class ProfileNotification extends AppCommand {
    code = 'notification';
    trigger = '通知';
    help = '';
    func: AppFunc<ProfileSession> = async (session: ProfileSession) => {
        if (!session.args.length) return;
        const profile = await profileGetBySession(session);
        switch (session.args[0]) {
            case 'on':
                profile.notif = 1;
                profile.save();
                return session.mentionTemp(
                    '已为你开启通知，通知时间为工作日晚6点-12点，非工作日早8点-晚12点。'
                );
            case 'onAll':
                session.user.grantRole(20683, '1843044184972950');
                profile.notif = 2;
                profile.save();
                return session.mentionTemp('已为你开启全天通知');
            case 'off':
                session.user.revokeRole(20683, '1843044184972950');
                profile.notif = 0;
                profile.save();
                return session.mentionTemp('已为你关闭通知');
            default:
                break;
        }
    };
}

// session.user.grantRole('1843044184972950', 20683);

export const profileNotification = new ProfileNotification();
