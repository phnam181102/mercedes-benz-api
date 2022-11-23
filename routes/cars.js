const express = require('express');
const router = express.Router();
const carController = require('../controller/carController');

router.get('/', carController.store);
router.post('/', carController.create);
router.get('/:slug', carController.show);
router.put('/:slug', carController.update);
router.delete('/:id', carController.delete);
module.exports = router;
