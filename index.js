const path = require("path");
const {ServiceBroker} = require("moleculer");

const broker = new ServiceBroker();

broker.loadService(path.resolve("services/gateway/service.js"));
broker.loadService(path.resolve("services/cars-generator/service.js"));
broker.loadService(path.resolve("services/currency/service.js"));

broker.start();
