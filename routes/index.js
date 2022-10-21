const carsRouter = require('./cars');
const usersRouter = require('./users');

function route(app) {
    app.use('/api/cars', carsRouter);
    app.use('/api/users', usersRouter);
    app.use('/', (req, res) => res.send('API not available!!!'));
}

module.exports = route;
