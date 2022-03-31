const MockModel = require("jest-mongoose-mock");
jest.mock('./../../models/account', () => new MockModel());
const Account = require('./../../models/account')
const { v4: uuidv4 } = require('uuid');
const AccountService = require("../account");
const {ObjectId} = require("mongodb");
describe('account service', () => {

    describe('createAccount', () => {
        beforeEach(() => {
            jest.resetAllMocks();
        });
        it('should create an account', async () => {
            const data = {
                number: uuidv4(),
                user: '62405281f31f9d4cbc7cc46c',
                amount: 100,
                inTransactions: [],
                outTransactions: [],
            }

            const createSpy = jest.spyOn(Account, 'create')
                .mockImplementationOnce(() => Promise.resolve(data))
            const result = await AccountService.createAccount(data)
            expect(createSpy).toBeCalledTimes(1);
            expect(result).toStrictEqual(data);

        })

        it('should return account', async () => {
            const data = {
                _id: ObjectId('62405281f31f9d4cbc7cc46a'),
                number: uuidv4(),
                user: ObjectId('62405281f31f9d4cbc7cc46c'),
                amount: 100,
                inTransactions: [],
                outTransactions: [],
                select: () => {
                    return { amount: 100 }
                }
            }

            const findSpy = jest.spyOn(Account, 'findOne')
                .mockImplementation(() => data)
            const result = await AccountService.getBalanceAccountByNumber(data['number'])
            expect(findSpy).toBeCalledTimes(1);
            expect(result).toStrictEqual({ amount: data.amount});

        })
    })
})