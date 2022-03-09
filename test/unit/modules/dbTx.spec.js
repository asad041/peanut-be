// const path = require('path');
// const sinon = require('sinon');
// const dbTx = require(path.join(srcDir, '/modules/dbTx'));
// const UserModel = mongoose.model('user');
//
// describe('dbTx', () => {
//
//   let sandbox = null;
//
//   beforeEach(async () => {
//
//     sandbox = sinon.createSandbox();
//
//     const rawUser = {
//       firstName: 'alice',
//       lastName: 'pastore',
//       email: 'alice@email.com',
//       password: 'pass1',
//       isActive: true,
//       isVerify: true,
//       type: UserModel.TYPE.USER
//     };
//
//     this.user = await UserModel.create(rawUser);
//
//   });
//
//   afterEach(() => {
//
//     sandbox && sandbox.restore();
//
//   });
//
//   describe('write tx', () => {
//
//     it('Should commit tx', async () => {
//
//       async function fn(tOpts) {
//
//         const rawUser = {
//           firstName: 'commit',
//           lastName: 'pastore',
//           email: 'commit@email.com',
//           password: 'pass1',
//           isActive: true,
//           isVerify: true,
//           type: UserModel.TYPE.USER
//         };
//
//         await new UserModel(rawUser).save(tOpts);
//
//         await tOpts.session.commitTransaction();
//         tOpts.session.endSession();
//
//       }
//
//       await dbTx.executeTxFn(fn);
//
//       const users = await UserModel.find().exec();
//       expect(users.length).to.eq(2);
//
//     });
//
//     it('Should revert tx', async () => {
//
//       async function fn(tOpts) {
//
//         const rawUser = {
//           firstName: 'commit',
//           lastName: 'pastore',
//           email: 'commit@email.com',
//           password: 'pass1',
//           isActive: true,
//           isVerify: true,
//           type: UserModel.TYPE.USER
//         };
//
//         await new UserModel(rawUser).save(tOpts);
//
//         await tOpts.session.abortTransaction();
//         tOpts.session.endSession();
//
//       }
//
//       await dbTx.executeTxFn(fn);
//
//       const users = await UserModel.find().exec();
//       expect(users.length).to.eq(1);
//
//     });
//
//   });
//
//   describe('retry tx', () => {
//
//     beforeEach(() => {
//
//       this.startTransaction = sinon.stub().resolves();
//       this.commitTransaction = sinon.stub().resolves();
//       this.abortTransaction = sinon.stub().resolves();
//       this.endSession = sinon.stub().resolves();
//
//       sandbox.stub(dbTx, 'transactionOptions').returns({
//         startTransaction: this.startTransaction,
//         commitTransaction: this.commitTransaction,
//         abortTransaction: this.abortTransaction,
//         endSession: this.endSession,
//       });
//
//     });
//
//     it('retry transaction error concurrent', async () => {
//
//       let i = 0;
//
//       async function fn(tOpts) {
//
//         expect(tOpts.session).to.exist;
//         if (i === 0 || i === 1) {
//           i++;
//           throw new Error('WriteConflict');
//         }
//         return 'ok';
//
//       }
//
//       const res = await dbTx.executeTxFn(fn);
//
//       expect(res).to.eq('ok');
//       expect(this.abortTransaction.callCount).to.eq(2);
//       expect(this.endSession.callCount).to.eq(2);
//
//     });
//
//     it('retry if already commited after aborted', async () => {
//
//       this.abortTransaction.rejects(new Error('Transaction cannot be reverted'));
//       let i = 0;
//
//       async function fn() {
//         i++;
//         if (i === 1) {
//           throw new Error('WriteConflict');
//         }
//         return 'ok';
//       }
//
//       const res = await dbTx.executeTxFn(fn);
//
//       expect(res).to.eq('ok');
//       expect(this.abortTransaction.callCount).to.eq(1);
//       expect(this.endSession.callCount).to.eq(0);
//       expect(i).to.eq(2);
//
//     });
//
//     it('retry transaction error not supported', async () => {
//
//       async function fn(tOpts) {
//         expect(tOpts.session).to.exist;
//         throw new Error('Current topology does not support sessions');
//       }
//
//       await expect(dbTx.executeTxFn(fn)).to.be.rejectedWith(Error, 'Current topology does not support sessions');
//
//     });
//
//     it('retry transaction error aborted error', async () => {
//
//       dbTx.transactionOptions.restore();
//       this.rollback = sinon.stub().resolves();
//       sandbox.stub(dbTx, 'transactionOptions').returns({
//         abortTransaction: this.abortTransaction,
//         startTransaction: this.startTransaction,
//         endSession: this.endSession,
//       });
//
//       let i = 0;
//
//       async function fn() {
//         i++;
//         if (i === 1 || i === 2) {
//           throw new Error('WriteConflict');
//         }
//         return 'ok';
//
//       }
//
//       const res = await dbTx.executeTxFn(fn);
//
//       expect(res).to.eq('ok');
//       expect(this.abortTransaction.callCount).to.eq(2);
//       expect(i).to.eq(3);
//
//     });
//
//     it('retry transaction error always concurrent', async () => {
//
//       async function fn() {
//         throw new Error('WriteConflict');
//       }
//
//       await expect(dbTx.executeTxFn(fn)).to.be.rejectedWith(Error, 'mongodb_concurrent');
//
//     });
//
//     it('works first', async () => {
//
//       async function fn() {
//         return 'ok';
//       }
//
//       const res = await dbTx.executeTxFn(fn);
//
//       expect(res).to.eq('ok');
//       expect(this.abortTransaction.callCount).to.eq(0);
//       expect(this.startTransaction.callCount).to.eq(1);
//
//     });
//
//     it('other error', async () => {
//
//       let i = 0;
//
//       async function fn() {
//         if (i === 0 || i === 1) {
//           i++;
//           throw new Error('WriteConflict');
//         }
//         throw new Error('something');
//
//       }
//
//       await expect(dbTx.executeTxFn(fn)).to.be.rejectedWith(Error, 'something');
//
//     });
//
//   });
//
// });
