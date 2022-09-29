const carsRouter = require('./cars');

function route(app) {
    app.use('/api/cars', carsRouter);
    app.use('/', (req, res) => res.send('API is not available!!!'));
}

module.exports = route;
