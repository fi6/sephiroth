import bot from './init/bot_init';
import db from './init/database_init';
import { arenaCardJob } from './init/routine.init';
import { log } from './init/logger';

db.on('error', console.error.bind(console, 'connection error:'));

bot.on('allMessages', (e: any) => {
    log.debug(e.data?.type, e);
});

log.debug(arenaCardJob.nextInvocation());

export {};
