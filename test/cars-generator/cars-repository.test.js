const assert = require("assert");
const MongoDbAdapter = require("moleculer-db-adapter-mongo");

const CarsRepository = require("../../services/cars-generator/lib/repository");

describe("CarsRepository", function () {
    const adapter = new MongoDbAdapter("mongodb://localhost/test_cars_db");
    const repository = new CarsRepository(adapter);

    before(async function () {
        adapter.service = {schema: {collection: "cars"}};

        await adapter.connect();

        adapter.service.schema.collection = "cars";
    });

    beforeEach(async function () {
        await adapter.removeMany({});
    });

    describe(".create", function () {
        it('should save a car', async function () {
            const car = {mark: "toyota", color: "black", price: 10000};

            const insertedCar = await repository.create(car);
            const result = await adapter.findById(insertedCar._id);

            assert.ok(result._id);
            assert.strictEqual(result.mark, car.mark);
            assert.strictEqual(result.color, car.color);
            assert.strictEqual(result.price, car.price);
        });
    });

    describe(".createMany", function () {
        it("should save a many cars", async function () {
            const cars = [
                {mark: "car_1", color: "color_1", price: 1},
                {mark: "car_2", color: "color_2", price: 2},
                {mark: "car_3", color: "color_3", price: 3},
            ];

            await repository.createMany(cars);

            const result = await adapter.find({});

            assert.strictEqual(result.length, 3);
        });
    });

    describe(".get", function () {
        it("should get cars", async function () {
            const currency = 65;

            await adapter.insertMany([
                {mark: "car_1", color: "black_1", price: 65},
                {mark: "car_2", color: "black_2", price: 65 * 2},
                {mark: "car_3", color: "black_3", price: 65 * 3},
            ]);

            const result = await repository.get({}, 0, currency);

            assert.strictEqual(result.length, 3);
            assert.strictEqual(result[0].price, 1);
            assert.strictEqual(result[1].price, 2);
            assert.strictEqual(result[2].price, 3);
        });

        it('should get cars with limit', async function () {
            await adapter.insertMany([
                {mark: "car_1", color: "black_1", price: 1},
                {mark: "car_2", color: "black_2", price: 2},
                {mark: "car_3", color: "black_3", price: 3},
            ]);

            const result = await repository.get({}, 1);

            assert.strictEqual(result.length, 1);
        });

        it('should get cars with filter by mark', async function () {
            await adapter.insertMany([
                {mark: "car_1", color: "black_1", price: 1},
                {mark: "car_2", color: "black_2", price: 2},
                {mark: "car_3", color: "black_3", price: 3},
            ]);

            const result = await repository.get({mark: "car_2"});

            assert.strictEqual(result.length, 1);
            assert.strictEqual(result[0].mark, "car_2");
        });

        it('should get cars with filter by color', async function () {
            await adapter.insertMany([
                {mark: "car_1", color: "black_1", price: 1},
                {mark: "car_2", color: "black_2", price: 2},
                {mark: "car_3", color: "black_3", price: 3},
                {mark: "car_4", color: "black_3", price: 3},
            ]);

            const result = await repository.get({color: "black_3"});

            assert.strictEqual(result.length, 2);
            assert.strictEqual(result[0].color, "black_3");
            assert.strictEqual(result[1].color, "black_3");
        });
    });

    describe(".getById", function () {
        it('should get a car by id', async function () {
            const currency = 65;
            const car = {mark: "toyota", color: "black", price: 65 * 5};

            const insertedCar = await adapter.insert(car);
            const result = await repository.getById(insertedCar._id, currency);

            assert.ok(result._id);
            assert.strictEqual(result.mark, car.mark);
            assert.strictEqual(result.color, car.color);
            assert.strictEqual(result.price, 5);
        });
    });

    describe(".update", function () {
        it('should update a car', async function () {
            const car = {mark: "toyota", color: "black", price: 10000};
            const updatedCar = {mark: "opel", color: "black", price: 5000};

            const insertedCar = await adapter.insert(car);

            await repository.update(insertedCar._id, updatedCar);

            const result = await adapter.findById(insertedCar._id);

            assert.strictEqual(result.mark, updatedCar.mark);
            assert.strictEqual(result.color, updatedCar.color);
            assert.strictEqual(result.price, updatedCar.price);
        });
    });

    describe(".delete", function () {
        it("should delete all cars", async function () {
            await adapter.insertMany([
                {mark: "car_1", color: "black_1", price: 1},
                {mark: "car_2", color: "black_2", price: 2},
                {mark: "car_3", color: "black_3", price: 3},
            ]);

            await repository.delete();

            const result = await adapter.find({});

            assert.strictEqual(result.length, 0);
        });
    });

    describe(".deleteById", function () {
        it("should delete a car by id", async function () {
            const cars = await adapter.insertMany([
                {mark: "car_1", color: "black_1", price: 1},
                {mark: "car_2", color: "black_2", price: 2},
                {mark: "car_3", color: "black_3", price: 3},
            ]);

            await repository.deleteById(cars[1]._id);

            const result = await adapter.find({});

            assert.strictEqual(result.length, 2);
        });
    });
});
