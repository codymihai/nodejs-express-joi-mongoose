const MockModel = require("jest-mongoose-mock");
jest.mock('./../../models/account', () => new MockModel());
jest.mock('./../../models/transaction', () => new MockModel());
const Account = require('./../../models/account')
const Transaction = require('./../../models/transaction')
const TransactionService = require("../transactions");
const shortid = require("shortid");
const {STATUS_TRANSACTION} = require("../../constants");
const {ObjectId} = require("mongodb");


describe('transactions service', () => {

    describe('make Transaction', () => {
        beforeEach(() => {
            jest.resetAllMocks();
        });
        it('should throw an error that the amount of account owner is below', async () => {
            const fromAccount = {
                populate: jest.fn(() => {
                   return { amount: 100 }
                }),
            }
            const toAccount = {
                amount: 101,
                populate: jest.fn()
            }

            const data = {
                amount: 200
            }
            //Account.findOne = jest.fn().mockImplementation(() => fromAccount)
            const findSpy = jest.spyOn(Account, 'findOne')
                .mockImplementation(() => toAccount)
                .mockImplementationOnce(() => fromAccount)

            try {
                await TransactionService.makeTransaction(data)
            } catch (e) {
                expect(e).toStrictEqual(new Error('Your Balance is below'));
                expect(findSpy).toHaveBeenCalledTimes(2);
            }
        })

        it('should send a sms for confirmation transaction', async () => {
            const fromAccount = {
                _id: ObjectId('62405281f31f9d4cbc7cc46a'),
                populate: jest.fn(() => {
                   return {
                       amount: 100,
                       _id: ObjectId('62405281f31f9d4cbc7cc46a'),
                       save: jest.fn(() => Promise.resolve()),
                       user: {
                           phoneNumber: '11111'
                       }
                   }
                })
            }
            const toAccount = {
                amount: 101,
                _id: ObjectId('62405281f31f9d4cbc7cc46b'),
                populate: jest.fn()
            }

            const data = {
                amount: 10,
                madeBy: ObjectId('62405281f31f9d4cbc7cc46c')
            }
            const transData = {
                number: shortid.generate(),
                fromAccount: fromAccount._id,
                toAccount: toAccount._id,
                madeBy: data.madeBy,
                amount: data.amount,
                status: STATUS_TRANSACTION.PENDING,
                approvedCode: shortid.generate()
            }
            const findSpy = jest.spyOn(Account, 'findOne')
                .mockImplementation(() => toAccount)
                .mockImplementationOnce(() => fromAccount)
            const createSpy = jest.spyOn(Transaction, 'create')
                .mockImplementation(() => transData)

            const sendSmsSpy = jest.spyOn(TransactionService, 'sendSms').mockImplementation(() => Promise.resolve())
            const result = await TransactionService.makeTransaction(data)

            expect(findSpy).toHaveBeenCalledTimes(2);
            expect(sendSmsSpy).toHaveBeenCalledTimes(1);
            expect(createSpy).toHaveBeenCalledTimes(1);
            expect(result).toStrictEqual(transData);

        })

    })

})