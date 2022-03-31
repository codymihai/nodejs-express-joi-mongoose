const router = require('express').Router();
const expressJoi = require('express-joi');
const UserService = require("../services/user");
const {hasAdminAccess} = require("./access");
const Joi = expressJoi.Joi;

const registerUserSchema = {
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    role: Joi.string().required(),
    password: Joi.string().required(),
};

/**
 * @swagger
 * /users/:
 *   post:
 *     tags:
 *       - user
 *     description: Register user
 *     requestBody:
 *          required: true
 *          description: user data
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
 *         description: user data
 */
router.post('/', [hasAdminAccess, expressJoi.joiValidate(registerUserSchema)],
        async (req, res, next) => {
    try {
        const user = await UserService.createUser(req.body)
        return res.json({ user });
    } catch (e) {
        next(e);
    }
});


module.exports = router;