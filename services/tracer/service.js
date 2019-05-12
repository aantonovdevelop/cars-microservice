const Tracer = require("moleculer-console-tracer");

module.exports = {
    mixins: [Tracer],
    settings: {
        width: 100,
        gaugeWidth: 50
    }
};
