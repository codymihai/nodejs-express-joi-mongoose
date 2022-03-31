const router = require('express').Router();

const {hasAccess} = require("./access");
const expressJoi = require("express-joi");
const TransactionService = require("../services/transactions");
const Joi = expressJoi.Joi;

const transactionSchema = {
    fromAccount: Joi.string().required(),
    toAccount: Joi.string().required(),
    amount: Joi.number().required(),
};

const approveSchema = {
    approveCode: Joi.string().required(),
    id: Joi.string().required(),
};

const historySchema = {
    id: Joi.string().required(),
    orderBy: Joi.string(),
    orderType: Joi.string(),
}
/**
 * @swagger
 * /transactions/:
 *   post:
 *     tags:
 *       - transaction
 *     description: Create a transaction
 *     requestBody:
 *          required: true
 *          description: transaction data
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          firstName:
 *                              type: string
 *                          lastName:
 *                              type: string
 *                          email:
 *                              type: string
 *                          role:
 *                              type: string
 *                          password:
 *                              type: string
 *     responses:
 *       200:
 *         description: transaction data
 */
router.post('/', [hasAccess, expressJoi.joiValidate(transactionSchema)],
    async (req, res, next) => {
        try {
            const data = req.body
            data.madeBy = req.user._id
            const transaction = await TransactionService.makeTransaction(data)
            return res.json({ transaction });
        } catch (e) {
            next(e);
        }
    });

/**
 * @swagger
 * /transactions/approve/{id}:
 *   patch:
 *     tags:
 *       - transaction
 *     description: approve a transaction
 *     parameters:
 *          - name: id
 *            in: path
 *            required: true
 *            schema:
 *              type: string
 *     requestBody:
 *          required: true
 *          description: transaction data
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          approvedCode:
 *                              type: string
 *     responses:
 *       200:
 *         description: transaction data
 */
router.patch('/approve/:id', [hasAccess, expressJoi.joiValidate(approveSchema)],
    async (req, res, next) => {
        try {
            const data = req.body
            const transaction = await TransactionService.approveTransaction(req.params.id, data)
            return res.json({ transaction });
        } catch (e) {
            next(e);
        }
    });


/**
 * @swagger
 * /transactions/history/{id}:
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
 *         - name: orderBy
 *            in: query
 *            schema:
 *              type: string
 *         - name: orderType
 *            in: query
 *            schema:
 *              type: string
 *     responses:
 *       200:
 *         description: Returns history.
 */
router.get('/history/:id', [hasAccess, expressJoi.joiValidate(historySchema)], async (req, res, next) => {
    try {
        const { orderBy, orderType } = req.query
        const account = await TransactionService.getTransactionsForAccount(req.params.id, orderBy, orderType)
        return res.json(account);
    } catch (e) {
        next(e);
    }
});

module.exports = router;