const mongoose = require('mongoose')
const { ObjectId } = require("mongodb");

const Schema = mongoose.Schema
const transactionSchema = new Schema({
    number: { type: String, unique: true},
    fromAccount: { type: ObjectId, ref: 'Account', required: true },
    toAccount: { type: ObjectId, ref: 'Account', required: true },
    madeBy: { type: ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    status: { type: String, required: true  },
    approvedCode: { type: String},
})

module.exports = mongoose.model('Transaction', new Schema(transactionSchema, { timestamps: true }))