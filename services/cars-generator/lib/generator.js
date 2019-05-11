"use strict";

const Colors = ["red", "yellow", "black", "green", "gray", "blue"];
const Models = ["Toyota", "Mercedes-Benz", "Opel", "Nissan", "Suzuki", "Fiat", "Audi"];

const MinPrice = 500000;
const MaxPrice = 2000000;

module.exports = class RandomCarsGenerator {
    // noinspection JSMethodCanBeStatic
    async generate(count) {
        const cars = [];

        for await (const car of carsGenerator(count)) {
            cars.push(car);
        }

        return cars;
    }
};

async function* carsGenerator(count) {
    for (const index of new Array(count)) {
        const car = {
            mark: Models[getRandom(0, Models.length)],
            color: Colors[getRandom(0, Colors.length)],
            price: getRandom(MinPrice, MaxPrice),
        };

        yield car;
    }
}

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
