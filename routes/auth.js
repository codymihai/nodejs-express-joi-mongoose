const router = require('express').Router();
const passport = require('passport');
const jwt = require("jsonwebtoken");

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - login
 *     description: Authenticate
 *     requestBody:
 *      required: true
 *      description: Credentials
 *      content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      email:
 *                          type: string
 *                      password:
 *                          type: string
 *     responses:
 *       200:
 *         description: Token
 */
router.post(
    '/login',
    async (req, res, next) => {
        passport.authenticate(
            'local',
            async (err, user, info) => {
                try {
                    if (err || !user) {
                        const error = new Error('An error occurred.');
                        return next(error);
                    }

                    req.login(
                        user,
                        { session: false },
                        async (error) => {
                            if (error) return next(error);

                            const body = { _id: user._id, email: user.email, role: user.role };
                            const token = jwt.sign({ user: body }, process.env.JWT_SECRET);

                            return res.json({ token });
                        }
                    );
                } catch (error) {
                    return next(error);
                }
            }
        )(req, res, next);
    }
);

module.exports = router;