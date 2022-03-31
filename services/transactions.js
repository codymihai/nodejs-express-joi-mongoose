const {STATUS_TRANSACTION} = require("../constants");
const Account = require('./../models/account')
const Transaction = require('./../models/transaction')
const shortid = require('shortid');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


/**
 * Transactions service
 */
class TransactionService {

    /**
     *
     * @param id
     * @param data
     * @returns {Promise<void>}
     */
    static async approveTransaction(id, data) {
        try {
            const transaction = await Transaction.findOne({ _id: id, approvedCode: data['approveCode']})
            if (transaction && transaction.status === STATUS_TRANSACTION.PENDING) {
                transaction.status = STATUS_TRANSACTION.EXECUTED
                const toAccount = await Account.findOne({_id: transaction.toAccount})
                toAccount.amount = toAccount.amount + transaction.amount;
                toAccount.inTransactions.push(transaction._id)
                await Promise.all([transaction.save(), toAccount.save()])
            } else {
                throw new Error('Your code has expired')
            }
        } catch (e) {
            throw e
        }
    }

    /**
     * Make a transaction
     * @param data
     * @returns {Promise<void|any>}
     */
    static async makeTransaction(data) {
        try {
            const fromAccount = await Account.findOne({ number: data.fromAccount}).populate('user')
            const toAccount = await Account.findOne({ number: data.toAccount})
            if (fromAccount.amount - data.amount < 0) {
                throw new Error('Your Balance is below')
            }
            const shortCode = shortid.generate()
            // TODO verify the accounts
            const transData = {
                number: shortid.generate(),
                fromAccount: fromAccount._id,
                toAccount: toAccount._id,
                madeBy: data.madeBy,
                amount: data.amount,
                status: STATUS_TRANSACTION.PENDING,
                approvedCode: shortCode
            }
            fromAccount.amount = fromAccount.amount - data.amount

            const response = await Promise.all([
                TransactionService.sendSms(fromAccount.user.phoneNumber, transData),
                Transaction.create(transData)])
            fromAccount.outTransactions.push(response[1]._id)
            await fromAccount.save()
            // reject a transaction if is not approved in 60 seconds
            setTimeout(() => {
                TransactionService.rejectTransaction(response)
            }, 60000)
            return response[1]
        } catch (e) {
            throw e
        }
    }

    /**
     * reject a transaction if is not approved
     * @param transData
     * @returns {Promise<void>}
     */
    static async rejectTransaction(transData) {
        try {
            const transaction = await Transaction.findOne({_id: transData._id})
            if (transaction.status === STATUS_TRANSACTION.PENDING) {
                transaction.status = STATUS_TRANSACTION.REJECTED
                const account = Account.findOne({_id: transaction.fromAccount})
                account.amount = account.amount + transaction.amount
                await Promise.all([transaction.save(), account.save()])
            }
        } catch (e) {
            throw e
        }
    }

    /**
     *
     * @param to - phone number
     * @param transData - transaction
     * @returns {Promise<void>}
     */
    static async sendSms(to, transData) {
        try {
            const message = `Urmeaza sa transferi ${transData.amount} $ catre ${transData.toAccount}. Codul de aprobare: ${transData.approvedCode}`
            client.messages
                .create({
                    body: message,
                    messagingServiceSid: process.env.TWILIO_SMS_SERVICE,
                    to
                })
                .then(message => console.log(message.sid));
        } catch (e) {
            throw e
        }
    }

    static async getTransactionsForAccount(fromAccountId, orderBy, orderType) {
        try {
            const sort = {}
            sort[orderBy] = orderType === 'ASC' ? 1: -1
            return Transaction.find({
                $or: [
                    { fromAccount: fromAccountId},
                    { toAccount: fromAccountId},
                ]
            }).sort(sort)

        } catch (e) {
            throw e
        }
    }
}

module.exports = TransactionService