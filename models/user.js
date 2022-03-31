const mongoose = require('mongoose')
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema
const userSchema = new Schema({
    firstName: { type: String },
    lastName: { type: String },
    phoneNumber: { type: String },
    password: { type: String },
    role: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
    },
})

userSchema.pre(
    'save',
    async function(next) {
        const hash = await bcrypt.hash(this.password, 15);

        this.password = hash;
        next();
    }
);

userSchema.methods.isValidPassword = async function(password) {
    const user = this;
    const compare = await bcrypt.compare(password, user.password);

    return compare;
}

module.exports = mongoose.model('User', new Schema(userSchema, { timestamps: true }))