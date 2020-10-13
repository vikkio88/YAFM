import Dexie from 'dexie';
import { getEntity } from './repositories';

const db = new Dexie('ads_db');

db.version(1).stores({
    teams: '&id,name,city,colours,status,nationality',
    players: '&id,name,surname,status,age,nationality,skill,value,position',
    coaches: '&id,name,surname,age,nationality,skill,module,status,teamId,contract,wage',
    teamPlayers: '++id,teamId,playerId,wage,contract', // need to remember about loan players
    teamStats: '++id,teamId,stats',
    playerStats: '++id,playerId,stats',
});

db.open().catch(function (e) {
    console.error("Open failed: " + e);
});


const entities = {
    players: getEntity('players', db)
};


export { db, entities };