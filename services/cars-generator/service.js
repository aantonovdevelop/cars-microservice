const {Service} = require("moleculer");
const MongoDbAdapter = require("moleculer-db-adapter-mongo");

const CarsRepository = require("./lib/repository");
const RandomCarsGenerator = require("./lib/generator");
const CarsGeneratorHandler = require("./lib/handler");

module.exports = class CarsGenerator extends Service {
    constructor(broker) {
        super(broker);

        const adapter = new MongoDbAdapter("mongodb://localhost/cars_db");

        const repository = new CarsRepository(adapter);
        const generator = new RandomCarsGenerator();

        const handler = new CarsGeneratorHandler(repository, generator);

        this.parseServiceSchema({
            name: "cars-generator",

            adapter: adapter,
            collection: "cars",

            actions: {
                getAll: {
                    params: {
                        mark: {type: "string", empty: false, optional: true},
                        color: {type: "string", empty: false, optional: true},
                        currency: {type: "number", convert: true, optional: true},
                        limit: {type: "number", positive: true, integer: true, convert: true, optional: true},
                    },
                    handler: (ctx) => handler.getAll.bind(handler)(ctx.params),
                },

                getById: {
                    params: {
                        id: {type: "string", empty: false},
                        currency: {type: "number", convert: true, optional: true},
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
            }
        });
    }
};
