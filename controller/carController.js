const Car = require('../models/Car');

const carController = {
    show: async (req, res, next) => {
        try {
            const car = await Car.findOne({ slug: req.params.slug });
            res.json(car);
        } catch (err) {
            res.json({ message: err });
        }
    },
    store: async (req, res, next) => {
        try {
            const cars = await Car.find();
            res.json(cars);
        } catch (err) {
            res.json({ message: err });
        }
    },
    create: async (req, res, next) => {
        const car = new Car(req.body);

        try {
            const savedCar = await car.save();
            res.json(savedCar);
        } catch (err) {
            res.json({ message: err });
        }
    },
    update: async (req, res, next) => {
        try {
            const updatedCar = await Car.updateOne({ _id: req.params.id }, req.body);
            res.json(updatedCar);
        } catch (err) {
            res.json({ message: err });
        }
    },
    delete: async (req, res, next) => {
        try {
            const removedCar = await Car.findByIdAndDelete(req.params.id);
            res.send(`Delete the car with id: ${req.params.id} successfully!!!`);
        } catch (err) {
            res.json({ message: err });
        }
    },
};

module.exports = carController;
