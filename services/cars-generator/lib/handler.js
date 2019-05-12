module.exports = class CarsGeneratorHandler {
    constructor(repository, generator, broker) {
        this.broker = broker;
        this.generator = generator;
        this.repository = repository;
    }

    async get({mark, color, limit, currency}) {
        const filter = {};

        if (mark) {
            filter.mark = mark;
        }

        if (color) {
            filter.color = color;
        }

        return this.repository.get(filter, limit, currency);
    }

    async getById({id, currency}) {
        return this.repository.getById(id, currency);
    }

    async create({mark, color, price}) {
        await this.broker.cacher.clean("cars-generator.**");

        return this.repository.create({mark, color, price});
    }

    async update({id, model, color, price}) {
        await this.broker.cacher.clean("cars-generator.**");

        return this.repository.update(id, {model, color, price});
    }

    async delete() {
        await this.broker.cacher.clean("cars-generator.**");

        return this.repository.delete();
    }

    async deleteById({id}) {
        await this.broker.cacher.clean("cars-generator.**");

        return this.repository.deleteById(id);
    }

    async generate({count}) {
        const cars = await this.generator.generate(+count);

        await this.broker.cacher.clean("cars-generator.**");

        return this.repository.createMany(cars);
    }
};
