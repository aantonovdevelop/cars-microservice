const assert = require("assert");

const RandomCarsGenerator = require("../../services/cars-generator/lib/generator");

describe("CarsGenerator", function () {
    const generator = new RandomCarsGenerator();

    describe(".generate", function () {
        it("should generate cars", async function () {
            const result = await generator.generate(10);

            assert.strictEqual(result.length, 10);

            assert.ok(result[0].mark.length > 0);
            assert.ok(result[0].color.length > 0);
            assert.ok(result[0].price > 0);
        });
    });
});

