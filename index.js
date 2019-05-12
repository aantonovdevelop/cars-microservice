const os = require("os");
const path = require("path");
const {ServiceBroker} = require("moleculer");

const broker = new ServiceBroker({
    metrics: true,
    cacher: "redis://cars-redis:6379",
    transporter: "nats://cars-nats:4222",
    nodeID: (process.env.NODEID ? process.env.NODEID + "-" : "") + os.hostname().toLowerCase(),
});

broker.loadService(path.resolve("services/tracer/service.js"));
broker.loadService(path.resolve("services/gateway/service.js"));
broker.loadService(path.resolve("services/cars-generator/service.js"));
broker.loadService(path.resolve("services/currency/service.js"));

broker.start();
