const { hasAdminAccess, hasAccess } = require("./access");
const router = require('express').Router();
const expressJoi = require('express-joi');
const AccountService = require("../services/account");
const Joi = expressJoi.Joi;

const createAccountSchema = {
    user: Joi.string().required(),
    amount: Joi.number(),
};

const balanceSchema = {
    accountNumber: Joi.string().required()
}

/**
 * @swagger
 * /accounts/:
 *   post:
 *     tags:
 *       - account
 *     description: Create an account
 *     requestBody:
 *          required: true
 *          description: Account data
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          user:
 *                              type: string
 *                          amount:
 *                              type: number
 *     responses:
 *       200:
 *         description: account data
 */
router.post('/', [hasAdminAccess, expressJoi.joiValidate(createAccountSchema)], async (req, res, next) => {
    try {
        const account = await AccountService.createAccount(req.body)
        return res.json(account);
    } catch (e) {
        next(e);
    }
});
/**
 * @swagger
 * /accounts/balance/{accountNumber}:
 *   get:
 *     tags:
 *       - account
 *     description: Get balance of account!
 *     parameters:
 *          - name: accountNumber
 *            in: path
 *            required: true
 *            schema:
 *              type: string
 *     responses:
 *       200:
 *         description: Returns balance.
 */
router.get('/balance/:accountNumber', [hasAdminAccess, expressJoi.joiValidate(balanceSchema)], async (req, res, next) => {
    try {
        const account = await AccountService.getBalanceAccountByNumber(req.params.accountNumber)
        return res.json(account);
    } catch (e) {
        next(e);
    }
});


/**
 * @swagger
 * /accounts/history/{accountNumber}:
 *   get:
 *     tags:
 *       - account
 *     description: Get history of account!
 *     parameters:
 *          - name: accountNumber
 *            in: path
 *            required: true
 *            schema:
 *              type: string
 *     responses:
 *       200:
 *         description: Returns history.
 */
router.get('/history/:accountNumber', [hasAccess, expressJoi.joiValidate(balanceSchema)], async (req, res, next) => {
    try {
        const account = await AccountService.getHistoryOfAccount(req.params.accountNumber)
        return res.json(account);
    } catch (e) {
        next(e);
    }
});



module.exports = router;
