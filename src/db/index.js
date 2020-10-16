import Dexie from 'dexie';
import { schemas } from './entities';
import { getRepository } from './repositories';

const db = new Dexie('ads_db');
db.version(1).stores(schemas);

db.open().catch(function (e) {
    console.error("Open failed: " + e);
});


const repositories = {
    teams: getRepository('teams', db),
    players: getRepository('players', db),
    coaches: getRepository('coaches', db),
};


export { db, repositories };