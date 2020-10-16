import { getEntity } from '../entities';

const getRepository = (table, db) => {
    const entity = getEntity(table);
    return new Entity(db, table, entity);
};

class Entity {
    db;
    primaryKey = 'id';
    tableName;
    table;
    entity;

    constructor(db, tableName, entity) {
        this.db = db;
        this.tableName = tableName;
        this.table = db[tableName];
        this.entity = entity;
    }


    create(object) {
        return this.table.add(object);
    }

    count() {
        return this.table.count();
    }

    getAll() {
        return this.table.toArray();
    }

    delete(id) {
        return this.table.where(this.primaryKey).equalsIgnoreCase(id).delete();
    }

    deleteAll() {
        return this.table.clear();
    }

    find(id) {
        return this.table.where(this.primaryKey).equalsIgnoreCase(id).toArray();
    }

    some(ids = []) {
        return this.table.where(this.primaryKey).anyOfIgnoreCase(ids).toArray();
    }

    select() {
        return this.table;
    }
}


export { getRepository, Entity };