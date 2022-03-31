const Account = require('./../models/account')
const { v4: uuidv4 } = require('uuid');

class AccountService {
    /**
     *
     * @param data
     * @returns {Promise<HydratedDocument<T & Document<any, any, any>, {}, {}>[]>}
     */
    static async createAccount(data) {
        try {
            data['number'] = uuidv4();
            return Account.create(data)
        } catch (e) {
            console.log('ERRROR:createAccount', e)
            throw e
        }
    }

    static async getHistoryOfAccount(number) {
        try {
            return Account.findOne({ number}).populate(['inTransactions', 'outTransactions'])
        } catch (e) {
            console.log('ERRROR:getHistoryOfAccount', e)
            throw e
        }
    }

    /**
     *
     * @param number
     * @returns {Promise<Query<T & Document<any, any, any> extends Document ? Require_id<T & Document<any, any, any>> : (Document<unknown, any, T & Document<any, any, any>> & Require_id<T & Document<any, any, any>>), T & Document<any, any, any> extends Document ? Require_id<T & Document<any, any, any>> : (Document<unknown, any, T & Document<any, any, any>> & Require_id<T & Document<any, any, any>>), {}, T & Document<any, any, any>>>}
     */
    static async getBalanceAccountByNumber(number) {
        return Account.findOne({ number}).select('amount')
    }
}

module.exports = AccountService