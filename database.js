const mongoose = require('mongoose')
const dbUrl = process.env.DATABASE_URL
const env = process.env.NODE_ENV || 'development'
const isLocal = env === 'development'
const initConnection = () => {
    mongoose.connect(dbUrl)
    isLocal && mongoose.set('debug', true)
}

initConnection()

require('./models/index')
