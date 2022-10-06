const express = require('express');

const router = express.Router();
const Car = require('../models/Car');

router.get('/', async (req, res) => {
    try {
        const cars = await Car.find();
        res.json(cars);
    } catch (err) {
        res.json({ message: err });
    }
});

router.post('/', async (req, res) => {
    const car = new Car(req.body);

    try {
        const savedCar = await car.save();
        res.json(savedCar);
    } catch (err) {
        res.json({ message: err });
    }
});

router.get('/:slug', async (req, res) => {
    try {
        const car = await Car.findOne({ slug: req.params.slug });
        res.json(car);
    } catch (err) {
        res.json({ message: err });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedCar = await Car.updateOne({ _id: req.params.id }, req.body);
        res.json(updatedCar);
    } catch (err) {
        res.json({ message: err });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const removedCar = await Car.findByIdAndDelete(req.params.id);
        res.send(`Delete the car with id: ${req.params.id} successfully!!!`);
    } catch (err) {
        res.json({ message: err });
    }
});
module.exports = router;
