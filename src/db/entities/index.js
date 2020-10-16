import pick from 'lodash.pick';

const schemas = {
    teams: '&id,name,city,colours,status,finance,nationality',
    players: '&id,name,surname,status,age,nationality,skill,value,position,teamId,wage,contract',
    coaches: '&id,name,surname,age,nationality,skill,module,status,teamId,wage,contract',
    teamStats: '++id,teamId',
    playerStats: '++id,playerId',
    coachStats: '++id,coachId',
};

const relations = {
    teams: [
        { key: 'roster', schema: 'teamPlayers', mappingColumn: 'teamId' },
        { key: 'coach', schema: 'coaches', mappingColumn: 'teamId' },
        { key: 'stats', schema: 'teamStats', mappingColumn: 'teamId' },
    ],
    players: [
        { key: 'stats', schema: 'playerStats', mappingColumn: 'playerId' }
    ],
    coaches: [
        { key: 'stats', schema: 'coachStats', mappingColumn: 'coachId' }
    ],
};

const getEntity = name => {
    const schema = schemas[name].split(',');
    const autoIncrement = /^\+{2}[a-zA-Z]+\d?/.test(schema[0]);
    const fields = schema.shift();
    const related = relations[name] || [];
    return {
        relations(object) {
            const relations = {};
            for (const relation of related) {
                let target = object[relation.key];
                if (Array.isArray(target)) {
                    relations[relation.schema] = target.map(row => {
                        return {
                            ...row,
                            [relation.mappingColumn]: object.id
                        };
                    });
                } else {
                    relations[relation.schema] = {
                        ...target,
                        [relation.mappingColumn]: object.id
                    };
                }
            }
            return relations;
        },
        filter(object) {
            const filtered = pick(object, fields);
            if (autoIncrement) return filtered;
            return {
                id: object.id,
                ...filtered
            };
        }
    };
};



export { schemas, getEntity };