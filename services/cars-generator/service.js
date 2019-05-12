const {Service} = require("moleculer");
const MongoDbAdapter = require("moleculer-db-adapter-mongo");

const CarsRepository = require("./lib/repository");
const RandomCarsGenerator = require("./lib/generator");
const CarsGeneratorHandler = require("./lib/handler");

const OneDay = 60*60*24;

module.exports = class CarsGenerator extends Service {
    constructor(broker) {
        super(broker);

        const adapter = new MongoDbAdapter("mongodb://cars-mongo/cars_db");

        const repository = new CarsRepository(adapter);
        const generator = new RandomCarsGenerator();

        const handler = new CarsGeneratorHandler(repository, generator, broker);

        this.parseServiceSchema({
            name: "cars-generator",

            adapter: adapter,
            collection: "cars",

            actions: {
                get: {
                    params: {
                        mark: {type: "string", empty: false, optional: true},
                        color: {type: "string", empty: false, optional: true},
                        currency: {type: "number", convert: true, optional: true},
                        limit: {type: "number", positive: true, integer: true, convert: true, optional: true},
                    },
                    cache: {
                        keys: ["mark", "color", "currency", "limit"],
                        ttl: OneDay,
                    },
                    handler: (ctx) => handler.get.bind(handler)(ctx.params),
                },

                getById: {
                    params: {
                        id: {type: "string", empty: false},
                        currency: {type: "number", convert: true, optional: true},
                    },
                    cache: {
                        keys: ["id", "currency"],
                        ttl: OneDay,
                    },
                    handler: (ctx) => handler.getById.bind(handler)(ctx.params),
                },

                create: {
                    params: {
                        mark: {type: "string", empty: false},
                        color: {type: "string", empty: false},
                        price: {type: "number", positive: true, convert: true},
                    },
                    handler: (ctx) => handler.create.bind(handler)(ctx.params),
                },

                update: {
                    params: {
                        id: {type: "string", empty: false},
                        mark: {type: "string", empty: false, optional: true},
                        color: {type: "string", empty: false, optional: true},
                        price: {type: "number", positive: true, convert: true, optional: true}
                    },
                    handler: (ctx) => handler.update.bind(handler)(ctx.params),
                },

                delete: {
                    handler: handler.delete.bind(handler),
                },

                deleteById: {
                    params: {
                        id: {type: "string", empty: false},
                    },
                    handler: (ctx) => handler.deleteById.bind(handler)(ctx.params),
                },

                generate: {
                    params: {
                        count: {type: "number", positive: true, integer: true, convert: true},
                    },
                    handler: (ctx) => handler.generate.bind(handler)(ctx.params),
                }
            },

            created: async () => {
                adapter.init(broker, this);

                await adapter.connect();

                await adapter.collection.ensureIndex({model: 1, color: 1});
            }
        });
    }
};
