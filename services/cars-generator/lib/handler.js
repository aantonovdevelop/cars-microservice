module.exports = class CarsGeneratorHandler {
    constructor(repository, generator) {
        this.generator = generator;
        this.repository = repository;
    }

    async getAll({mark, color, limit, currency}) {
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
        return this.repository.create({mark, color, price});
    }

    async update({id, model, color, price}) {
        return this.repository.update(id, {model, color, price});
    }

    async delete() {
        return this.repository.delete();
    }

    async deleteById({id}) {
        return this.repository.deleteById(id);
    }

    async generate({count}) {
        const cars = await this.generator.generate(+count);

        return this.repository.createMany(cars);
    }
};
