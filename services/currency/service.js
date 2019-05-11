const {Service} = require("moleculer");

const CBRFFetcher = require("./lib/cbrf");
const CurrencyHandler = require("./lib/handler");

module.exports = class Currency extends Service {
    constructor(broker) {
        super(broker);

        const handler = new CurrencyHandler(new CBRFFetcher());

        this.parseServiceSchema({
            name: "currency",

            actions: {
                get: {
                    params: {
                        currency: {type: "enum", values: ["usd", "eur"]},
                    },
                    handler: async (ctx) => handler.get.bind(handler)(ctx.params),
                },
            },
        });
    }
};
