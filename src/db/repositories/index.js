const makeRepository = (table, db) => {
    table = db[table];
    return {
        create(object) {
            return table.add(object);
        },
        count() {
            return table.count();
        },
        getAll() {
            return table.toArray();
        },
        delete(id) {
            return table.where('id').equalsIgnoreCase(id).delete();
        },
        deleteAll() {
            return table.clear();
        },
        find(id) {
            return table.where('id').equalsIgnoreCase(id).toArray();
        },
        some(ids = []) {
            return table.where('id').anyOfIgnoreCase(ids).toArray();
        }
    };
};


export { makeRepository };