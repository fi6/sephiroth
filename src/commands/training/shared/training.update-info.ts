import { channels } from '../../../configs';
import bot from '../../../init/bot_init';
import { TrainingArenaDoc } from '../../../models/TrainingArena';
import { trainingInfoCard } from '../card/training.info.card';

/**
 * with save
 */
export function updateTraininginfo(arena: TrainingArenaDoc): void {
    // if (!arena.card) {
    //     throw new Error('no arena card sent');
    // }
    // bot.API.message.delete(arena.card).catch((e) => {
    //     console.error(e);
    // });
    // bot.API.message
    //     .create(10, channels.arenaBot, trainingInfoCard(arena))
    //     .then((result) => {
    //         arena.card = result.msgId;
    //         arena.save();
    //     });
}
