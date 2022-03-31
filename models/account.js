const mongoose = require('mongoose')
const { ObjectId } = require("mongodb");

const Schema = mongoose.Schema
const accountSchema = new Schema({
    number: { type: String, unique: true},
    user: { type: ObjectId, ref: 'User', required: true },
    amount: { type: Number, default: 100},
    inTransactions: [{ type: ObjectId, ref: 'Transaction', required: true }],
    outTransactions: [{ type: ObjectId, ref: 'Transaction', required: true }]
})

module.exports = mongoose.model('Account', new Schema(accountSchema, { timestamps: true }))