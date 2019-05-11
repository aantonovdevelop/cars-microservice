const {Service} = require("moleculer");
const ApiService = require("moleculer-web");

const GatewayHandler = require("./lib/handler");

module.exports = class Gateway extends Service {
    constructor(broker) {
        super(broker);

        const handler = new GatewayHandler(broker);

        this.parseServiceSchema({
            name: "gateway",

            mixins: [ApiService],

            actions: {
                get: {
                    params: {
                        mark: {type: "string", empty: false, optional: true},
                        color: {type: "string", empty: false, optional: true},
                        currency: {type: "enum", values: ["usd", "eur"], optional: true},
                        limit: {type: "number", convert: true, positive: true, integer: false, optional: true},
                    },
                    handler: async (ctx) => handler.get.bind(handler)(ctx.params),
                },

                getById: {
                    params: {
                        id: {type: "string", empty: false},
                        currency: {type: "enum", values: ["usd", "eur"], optional: true},
                    },
                    handler: async (ctx) => handler.getById.bind(handler)(ctx.params),
                }
            },

            settings: {
                routes: [{
                    aliases: {
                        "GET cars": "gateway.get",
                        "GET cars/:id": "gateway.getById",
                        "POST cars": "cars-generator.create",
                        "PUT cars/:id": "cars-generator.update",
                        "DELETE cars": "cars-generator.delete",
                        "DELETE cars/:id": "cars-generator.deleteById",
                    },
                }],
            },
        });
    }
};
