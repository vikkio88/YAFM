import Dexie from 'dexie';
import { getEntity } from './repositories';

const db = new Dexie('ads_db');

db.version(1).stores({
    players: '&id,name,surname,team,status,morale,injured,stats,history,age,nationality,skill,value,position,wage',
});

db.open().catch(function (e) {
    console.error("Open failed: " + e);
});


const entities = {
    players: getEntity('players', db)
};


export { db, entities };