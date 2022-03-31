require('dotenv').config()
const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 4000;


const app = express()

require('./database')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'My Bank',
            version: '1.0.0',
        },
        components: {
            schemas: {},
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            { bearerAuth: [] },
        ],
    },
    apis: ['./routes/*.js'],
};
const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(require('./routes'))


require('./config/passport');
app.use((err, req, res, next) => {
    let error = {};
    res.status(err.status || 500);
    res.json({
        errors: {
            message: err.message,
            error: error
        }
    });
});
app.listen(process.env.PORT || 4000, () => {
    console.log(`Listening on port ${PORT}`);
});

