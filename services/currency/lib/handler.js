module.exports = class CurrencyHandler {
    constructor(cbrf) {
        this.cbrf = cbrf;
    }

    get({currency}) {
        return this.cbrf.get(currency, new Date().toISOString());
    }
};
