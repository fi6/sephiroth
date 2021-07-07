import { Card } from 'kbotify/dist/core/card';
import { channels } from '../../../configs';
import { ArenaDoc } from '../../../models/Arena';
import { formatTime } from '../../../utils/format-time';
import { mentionUser } from '../../../utils/khl';

export function createStartCard() {
    return new Card({
        type: 'card',
        theme: 'info',
        size: 'lg',
        modules: [
            {
                type: 'header',
                text: {
                    type: 'plain-text',
                    content: '创建房间',
                },
            },
            {
                type: 'section',
                text: {
                    type: 'plain-text',
                    content:
                        '如果你还不熟悉使用方法，可以点击右侧按钮，机器人将协助你创建。',
                },
                mode: 'right',
                accessory: {
                    type: 'button',
                    theme: 'success',
                    click: 'return-val',
                    value: '.房间 创建 hp',
                    text: {
                        type: 'plain-text',
                        content: '开始创建',
                    },
                },
            },
            {
                type: 'divider',
            },
            {
                type: 'section',
                text: {
                    type: 'kmarkdown',
                    content: '如果你熟悉机器人的使用方法，可以使用命令创建。',
                },
            },
            {
                type: 'section',
                text: {
                    type: 'kmarkdown',
                    content:
                        '创建房间的指令格式：\n`.建房 房间号 密码 加速/人数 (留言)`',
                },
            },
        ],
    });
}

export function createHelpCard(oldArena: ArenaDoc | null) {
    const now = Date.now();
    let example = '例: `5F23C  147  帆游自动3人  剑人练习专场`';
    if (oldArena) {
        example =
            '上次的房间信息：`' +
            [
                oldArena.code,
                oldArena.password,
                oldArena.info,
                oldArena.title,
            ].join(' ') +
            '`\n房间号为必填，其他为选填。系统会自动继承上次的房间信息。';
    }
    return new Card({
        type: 'card',
        theme: 'info',
        size: 'lg',
        modules: [
            {
                type: 'header',
                text: {
                    type: 'plain-text',
                    content: '创建房间',
                },
            },
            {
                type: 'section',
                text: {
                    type: 'kmarkdown',
                    content:
                        '请输入`房间号  密码  房间信息  房间标题`，用空格分开。',
                },
            },
            {
                type: 'section',
                text: {
                    type: 'kmarkdown',
                    content: example,
                },
            },
            {
                type: 'countdown',
                mode: 'second',
                startTime: now,
                endTime: now + 120 * 1e3,
            },
            {
                type: 'context',
                elements: [
                    {
                        type: 'plain-text',
                        content:
                            '请在倒计时结束前完成输入。如果不打算使用语音，请在房间标题中说明。',
                    },
                ],
            },
        ],
    });
}

export function createSuccessCard(arena: ArenaDoc, helpFlag = false) {
    const memberString = '房间中还没有人。快去广播吧！';
    const card1 = new Card({
        type: 'card',
        theme: 'success',
        size: 'lg',
        modules: [
            {
                type: 'header',
                text: {
                    type: 'plain-text',
                    content: '房间创建成功',
                },
            },
            {
                type: 'section',
                text: {
                    type: 'kmarkdown',
                    content: `如需更改房间信息或关闭房间，请点击上方管理房间按钮。\n如果无人加入，房间将于10分钟后自动关闭。`,
                },
            },
        ],
    });
    const card2 = new Card({
        type: 'card',
        theme: 'info',
        size: 'lg',
        modules: [
            {
                type: 'header',
                text: {
                    type: 'plain-text',
                    content: arena.title,
                },
            },
            {
                type: 'section',
                text: {
                    type: 'paragraph',
                    cols: 3,
                    fields: [
                        {
                            type: 'kmarkdown',
                            content: `**房间号/密码**\n${arena.code} ${arena.password}`,
                        },
                        {
                            type: 'kmarkdown',
                            content: `**房间信息**\n${arena.info ?? ''}`,
                        },
                        {
                            type: 'kmarkdown',
                            content: `**有效至**\n${formatTime(
                                arena.expireAt
                            )}`,
                        },
                    ],
                },
                mode: 'right',
                accessory: {
                    type: 'button',
                    theme: 'secondary',
                    value: `.房间 广播`,
                    click: 'return-val',
                    text: {
                        type: 'plain-text',
                        content: '广播',
                    },
                },
            },
            {
                type: 'context',
                elements: [
                    {
                        type: 'plain-text',
                        content: memberString,
                    },
                ],
            },
        ],
    });
    return [
        card1,
        card2,
        new Card()
            .addText(
                '你的专属语音房间已在左侧显示。**请尽量加入语音，有交流的对战更有趣！**\n' +
                    `你也可以在(chn)${channels.chat}(chn)和其他人聊聊天。`
            )
            .addModule({
                type: 'context',
                elements: [
                    {
                        type: 'kmarkdown',
                        content:
                            '开黑啦官方活动：创建邀请链接并邀请2名好友加入就可以获得开黑啦会员～[活动地址](https://www.kaiheila.cn/activities/1/index.html)',
                    },
                ],
            }),
    ];
}
