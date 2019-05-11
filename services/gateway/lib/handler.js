const SameCost = 1;

module.exports = class GatewayHandler {
    constructor(broker) {
        this.broker = broker;
    }

    async get({mark, color, currency, limit}) {
        const currencyPrice = currency ? await this.broker.call("currency.get", {currency}) : SameCost;

        return this.broker.call("cars-generator.getAll", {mark, color, limit, currency: Number.parseFloat(currencyPrice)});
    }

    async getById({id, currency}) {
        const currencyPrice = currency ? await this.broker.call("currency.get", {currency}) : SameCost;

        return this.broker.call("cars-generator.getById", {id, currency: Number.parseFloat(currencyPrice)});
    }
};
