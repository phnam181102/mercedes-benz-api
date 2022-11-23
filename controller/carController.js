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

        car.avatar = [req.body.avatar1, req.body.avatar2];

        car.keyFeatures = [
            'Pearl White Paint',
            '19’’ Gemini Wheels',
            'All Black Premium Interior',
            'Five Seat Interior',
            'Full Self-Driving Capability',
            'Acceleration Boost',
        ];

        try {
            const savedCar = await car.save();
            res.redirect(`http://localhost:3001/adminpanel/`);
        } catch (err) {
            res.json({ message: err });
        }
    },
    update: async (req, res, next) => {
        try {
            const updatedCar = await Car.updateOne({ slug: req.params.slug }, req.body);
            res.redirect(`http://localhost:3001/adminpanel/`);
        } catch (err) {
            res.json({ message: err });
        }
    },
    delete: async (req, res, next) => {
        try {
            const removedCar = await Car.findByIdAndDelete(req.params.id);
            res.redirect(`http://localhost:3001/adminpanel/`);
        } catch (err) {
            res.json({ message: err });
        }
    },
};

module.exports = carController;
