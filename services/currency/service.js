const soap = require("soap");
const {Service} = require("moleculer");

const CBRFFetcher = require("./lib/cbrf");
const CurrencyHandler = require("./lib/handler");

const OneHour = 60 * 60;

module.exports = class Currency extends Service {
    constructor(broker) {
        super(broker);

        const handler = new CurrencyHandler(new CBRFFetcher(soap));

        this.parseServiceSchema({
            name: "currency",

            actions: {
                get: {
                    params: {
                        currency: {type: "enum", values: ["usd", "eur"]},
                    },
                    cache: {
                        ttl: OneHour,
                        keys: ["currency"],
                    },
                    handler: async (ctx) => handler.get.bind(handler)(ctx.params),
                },
            },
        });
    }
};
