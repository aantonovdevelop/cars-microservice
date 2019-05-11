const Unlimited = 0;
const SameCost = 1;

module.exports = class CarsRepository {
    constructor(adapter) {
        this.adapter = adapter;
    }

    create(car) {
        return this.adapter.insert(car);
    }

    createMany(cars) {
        return this.adapter.insertMany(cars);
    }

    get(filter = {}, limit = Unlimited, currency = SameCost) {
        let pipeline = [{
            $match: filter,
        }, {
            $addFields: {
                price: {$floor: {$divide: ["$price", currency]}},
            }
        }];

        if (limit) {
            pipeline = [{$limit: +limit}, ...pipeline];
        }

        return this.adapter.collection.aggregate(pipeline).toArray();
    }

    getById(id, currency = SameCost) {
        return this.adapter.findById(id)
            .then((result) => {
                if (result) {
                    result.price = Math.floor(result.price / currency);

                    return result;
                }
            });
    }

    update(id, car) {
        return this.adapter.updateById(id, {$set: car});
    }

    delete() {
        return this.adapter.removeMany({});
    }

    deleteById(id) {
        return this.adapter.removeById(id);
    }
};
