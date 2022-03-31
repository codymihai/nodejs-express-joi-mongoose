

const seed = async () => {
    const app = require('../app');
    const mongoose = require('mongoose');
    const UserService = require("../services/user");
    const { USER_ROLES } = require("../constants");

    const data = {
        email: 'admin@test.com',
        firstName: 'Admin',
        lastName: 'Admin',
        phoneNumber: '+12135348470',
        password: '12345',
        role: USER_ROLES.ADMIN
    }
    await UserService.createUser(data)

};

seed();
