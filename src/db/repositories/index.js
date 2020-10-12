const getEntity = (table, db) => {
    return new Entity(db, table);
};

class Entity {
    db;
    primaryKey = 'id';
    tableName;
    table;

    constructor(db, tableName) {
        this.db = db;
        this.tableName = tableName;
        this.table = db[tableName];
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


export { getEntity, Entity };