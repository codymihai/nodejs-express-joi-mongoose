const router = require('express').Router();

router.use('/users', require('./users'));
router.use('/accounts', require('./accounts'));
router.use('/transactions', require('./transactions'));
router.use('/auth', require('./auth'));

router.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

module.exports = router;


