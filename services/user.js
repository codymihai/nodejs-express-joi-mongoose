const mongoose = require('mongoose');
const User = mongoose.model('User');
class UserService {
    static async createUser(data) {
        console.log('DATA', data)
        return User.create(data)
    }
}

module.exports = UserService