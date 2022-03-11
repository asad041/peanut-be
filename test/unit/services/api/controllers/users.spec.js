// const path = require('path');
// const sinon = require('sinon');
// const CoinModel = mongoose.model('coin');
// const config = require(path.join(srcDir, '../config'));
// const CoinCtrl = require(path.join(srcDir, '/services/api/controllers/coin'));
// const logger = require(path.join(srcDir, '/modules/logger'));
//
// describe('Controller:users', () => {
//
//   let sandbox = null;
//
//   beforeEach(async () => {
//
//     sandbox = sinon.createSandbox();
//
//
//     this.coin = await CoinModel.create({
//       firstName: 'firstName1',
//       lastName: 'lastName1',
//       email: 'default@email.com',
//       password: 'pass1',
//       isActive: true,
//       isVerify: true,
//       Image: this.image._id
//     });
//
//   });
//
//   afterEach(() => {
//
//     config.ALLOW_SIGNUP = true;
//     // config.MAIL.SENDINBLUE_SIGN_LIST_NEWSLETTER = null;
//     // config.MAIL.SENDINBLUE_SIGN_LIST = null;
//     sandbox && sandbox.restore();
//
//   });
//
//   it('Disable signup', async () => {
//
//     config.ALLOW_SIGNUP = false;
//     await expect(UserCtrl.create({}))
//       .to.be.rejectedWith(Error, 'signup_disabled');
//
//   });
//
//   it('Should validate email', async () => {
//
//     const token = {value: 'xxx', deleteOne: sandbox.stub()};
//     const getToken = sandbox.stub().resolves([token]);
//
//     const rawUser = {
//       firstName: 'firstName1',
//       lastName: 'lastName1',
//       email: '1@email.com',
//       password: 'pass1',
//       isActive: true,
//       isVerify: false,
//       update: sandbox.stub(),
//       reload: sandbox.stub(),
//       getTokensByType: getToken,
//     };
//
//     const response = await UserCtrl.validateEmail(rawUser, token.value);
//
//     expect(response).to.be.true;
//     expect(getToken.calledOnce).to.be.true;
//     expect(getToken.calledWith(TokenModel.TYPE.VERIFY_EMAIL)).to.be.true;
//
//     expect(rawUser.update.calledOnce).to.be.true;
//     expect(rawUser.update.calledWith({isVerify: true})).to.be.true;
//     expect(token.deleteOne.calledOnce).to.be.true;
//
//   });
//
//   it('Should subscribe newsletter', async () => {
//
//     const email = 'xxx@me.com';
//
//     await UserCtrl.newsletter({email});
//
//     expect(this.stubSendinblueSubscribe.calledOnce).to.be.true;
//
//     expect(this.stubSendinblueSubscribe.calledWith({
//       email,
//       firstName: undefined,
//       lastName: undefined
//     }, [config.MAIL.SENDINBLUE_SIGN_LIST_NEWSLETTER])).to.be.true;
//
//   });
//
//   describe('Disable User', () => {
//
//     it('Should disable user', async () => {
//
//       const token = 'zzz';
//
//       const oldUser = this.user1.toObject();
//       const stubLogger = sandbox.stub(logger, 'verbose');
//       const stubLogout = sandbox.stub(UserCtrl, 'logout').resolves();
//       const spyUser = sandbox.spy(this.user1, 'update');
//       const stubImageCtrl = sandbox.stub(ImageAdminCtrl, 'delete').resolves();
//
//       const res = await UserCtrl.disableUser(this.user1, token);
//
//       await this.user1.reload();
//
//       expect(stubImageCtrl.calledWith(oldUser.Image, false)).to.be.true;
//       expect(spyUser.calledOnce).to.be.true;
//       expect(spyUser.args[0][0].disabledAt).to.exist;
//
//       expect(stubLogout.calledOnce).to.be.true;
//       expect(stubLogout.args[0][0].email).to.exist;
//       expect(stubLogout.args[0][1]).to.eq(token);
//
//       expect(stubLogger.calledOnce).to.be.true;
//       expect(stubLogger.args[0][0]).to.eq('Disable User');
//       expect(res).to.be.true;
//
//     });
//
//     it('Should disable user with missing image', async () => {
//
//       const token = 'zzz';
//       const oldUser = this.user1.toObject();
//
//       const stubLogger = sandbox.stub(logger, 'verbose');
//       const stubImageCtrl = sandbox.stub(ImageAdminCtrl, 'delete').resolves(false);
//       const stubLogout = sandbox.stub(UserCtrl, 'logout').resolves();
//       const spyUser = sandbox.spy(this.user1, 'update');
//
//       const res = await UserCtrl.disableUser(this.user1, token);
//
//       await this.user1.reload();
//
//       expect(stubImageCtrl.calledWith(oldUser.Image, false)).to.be.true;
//       expect(spyUser.calledOnce).to.be.true;
//       expect(spyUser.args[0][0].disabledAt).to.exist;
//
//       expect(stubLogout.calledOnce).to.be.true;
//       expect(stubLogout.args[0][0].email).to.exist;
//       expect(stubLogout.args[0][1]).to.eq(token);
//
//       expect(stubLogger.calledOnce).to.be.true;
//       expect(stubLogger.args[0][0]).to.eq('Disable User');
//       expect(res).to.be.true;
//
//     });
//
//   });
//
//   describe('Creation', () => {
//
//     it('Should create and get user', async () => {
//
//       const token = {
//         token: 'tokenId',
//       };
//
//       const rawUser = {
//         firstName: 'firstName1',
//         lastName: 'lastName1',
//         email: '1@email.com',
//         password: 'pass1',
//         isActive: true,
//         isVerify: false,
//         update: sandbox.stub(),
//         reload: sandbox.stub(),
//         getReview: sandbox.stub(),
//       };
//
//       const stubFindByEmail = sandbox.stub(UserModel, 'findByEmail').resolves(null);
//       const stubCreate = sandbox.stub(UserModel, 'create').resolves(rawUser);
//       const stubAutoCreate = sandbox.stub(UserCtrl, '_autoCreate').resolves();
//       const stubForVerifyEmail = sandbox.stub(TokenModel, 'createForVerifyEmail').resolves(token);
//
//       const user = await UserCtrl.create(rawUser);
//
//       expect(user.email).to.eq(rawUser.email);
//       expect(stubFindByEmail.calledOnce).to.be.true;
//       expect(stubFindByEmail.calledWith(rawUser.email)).to.be.true;
//
//       expect(stubCreate.calledOnce).to.be.true;
//       expect(stubCreate.args[0][0].email).to.eq(rawUser.email);
//       expect(stubCreate.args[0][0].isActive).to.eq(true);
//
//       expect(stubAutoCreate.calledOnce).to.be.true;
//       expect(stubAutoCreate.args[0][0].email).to.eq(rawUser.email);
//
//       expect(stubForVerifyEmail.calledOnce).to.be.true;
//       expect(stubForVerifyEmail.args[0][0].email).to.eq(rawUser.email);
//
//       expect(this.sendActivateAccountMail.calledOnce).to.be.true;
//       expect(this.sendActivateAccountMail.args[0][0].email).to.eq(rawUser.email);
//       expect(this.sendActivateAccountMail.args[0][1]).to.eq(token.value);
//
//     });
//
//     it('Should create with appleToken and get user', async () => {
//
//       const token = {
//         token: 'tokenId',
//       };
//       const rawUser = {
//         firstName: 'firstName1',
//         lastName: 'lastName1',
//         email: '1@email.com',
//         password: 'pass1',
//         isActive: true,
//         isVerify: false,
//         update: sandbox.stub(),
//         reload: sandbox.stub(),
//         getReview: sandbox.stub(),
//       };
//
//       const appleToken = 'xxx';
//
//       const stubGetCAPublicKey = sandbox.stub(AppleHelper, 'getCAPublicKey').resolves('xxx');
//       const stubVerifyAppleIdentity = sandbox.stub(AppleHelper, 'verifyAppleIdentity').resolves(true);
//
//       const stubFindByEmail = sandbox.stub(UserModel, 'findByEmail').resolves(null);
//       const stubCreate = sandbox.stub(UserModel, 'create').resolves(rawUser);
//       const stubAutoCreate = sandbox.stub(UserCtrl, '_autoCreate').resolves();
//       const stubForVerifyEmail = sandbox.stub(TokenModel, 'createForVerifyEmail').resolves(token);
//
//       const user = await UserCtrl.create(rawUser, appleToken);
//
//       expect(stubGetCAPublicKey.calledWith(appleToken)).to.be.true;
//       expect(stubVerifyAppleIdentity.calledWith(appleToken, 'xxx')).to.be.true;
//
//       expect(user.email).to.eq(rawUser.email);
//       expect(stubFindByEmail.calledOnce).to.be.true;
//       expect(stubFindByEmail.calledWith(rawUser.email)).to.be.true;
//
//       expect(stubCreate.calledOnce).to.be.true;
//       expect(stubCreate.args[0][0].email).to.eq(rawUser.email);
//       expect(stubCreate.args[0][0].isActive).to.eq(true);
//       expect(stubCreate.args[0][0].isVerify).to.eq(true);
//       expect(stubCreate.args[0][0].password).to.exist;
//
//       expect(stubAutoCreate.calledOnce).to.be.true;
//       expect(stubAutoCreate.args[0][0].email).to.eq(rawUser.email);
//
//       expect(stubForVerifyEmail.notCalled).to.be.true;
//       expect(this.sendActivateAccountMail.notCalled).to.be.true;
//
//     });
//
//     it('Should not create user if email already exist', async () => {
//
//       const rawUser = {
//         firstName: 'firstName1',
//         lastName: 'lastName1',
//         email: '1@email.com',
//         password: 'pass1',
//         isActive: true,
//         isVerify: false,
//         update: sandbox.stub(),
//         reload: sandbox.stub(),
//         getReview: sandbox.stub(),
//       };
//
//       sandbox.stub(UserModel, 'findByEmail').resolves(rawUser);
//
//       await expect(UserCtrl.create(rawUser)).to.be.rejectedWith(Error, 'already_exists');
//
//     });
//
//     it('Should not create user if permalink already exist', async () => {
//
//       const rawUser1 = {
//         firstName: 'firstName1',
//         lastName: 'lastName1',
//         email: '1@email.com',
//         password: 'pass1',
//       };
//
//       await UserCtrl.create(rawUser1);
//
//       const rawUser2 = {
//         firstName: 'firstName1',
//         lastName: 'lastName1',
//         email: '1@email.com',
//         password: 'pass2',
//       };
//
//       await expect(UserCtrl.create(rawUser2)).to.be.rejectedWith(Error, 'already_exists');
//
//     });
//
//     it('Should throw error', async () => {
//
//       const rawUser = {
//         firstName: 'firstName1',
//         lastName: 'lastName1',
//         email: '1@email.com',
//         password: 'pass1',
//       };
//
//       sandbox.stub(UserModel, 'create').rejects(new Error('fake-error'));
//
//       await expect(UserCtrl.create(rawUser)).to.be.rejectedWith(Error, 'fake-error');
//
//     });
//
//     it('Should autocreate', async () => {
//
//       const user = await UserCtrl.create({
//         firstName: 'firstName1',
//         lastName: 'lastName1',
//         email: 'xxx@af.com',
//         password: 'pass1',
//       });
//
//       await UserCtrl._autoCreate(user);
//
//       const notification = await user.getNotification();
//       const wallet = await user.getWallet();
//
//       expect(notification.newsletter).to.eq(true);
//       expect(wallet.amount).to.eq('0');
//
//     });
//
//   });
//
//   describe('Update', () => {
//
//     it('Should update a user', async () => {
//
//       const params = {
//         firstName: 'firstNameChanged',
//         lastName: 'lastNameChanged'
//       };
//
//       const userInfo = await UserCtrl.update(this.user1, params);
//
//       await this.user1.reload();
//
//       expect(userInfo.firstName).eq('firstnamechanged');
//       expect(userInfo.lastName).eq('lastnamechanged');
//
//       expect(this.user1.firstName).eq('firstnamechanged');
//       expect(this.user1.lastName).eq('lastnamechanged');
//
//     });
//
//     it('Should update a user mobile', async () => {
//
//       const params = {
//         mobile: '+390324234',
//       };
//
//       const userInfo = await UserCtrl.update(this.user1, params);
//
//       await this.user1.reload();
//
//       expect(userInfo.mobile).eq(params.mobile);
//       expect(this.user1.mobile).eq(params.mobile);
//
//     });
//
//     it('Should only update mobile', async () => {
//
//       const params = {
//         mobile: '+390324234',
//         lastName: 'lastNameChanged'
//       };
//
//       const userInfo = await UserCtrl.update(this.user1, params);
//
//       await this.user1.reload();
//
//       expect(userInfo.mobile).eq(params.mobile);
//       expect(this.user1.mobile).eq(params.mobile);
//       expect(this.user1.lastName).to.not.equal(params.mobile);
//
//     });
//
//     it('Should update a user with optional params birthday', async () => {
//
//       const params = {
//         firstName: 'firstNameChanged',
//         lastName: 'lastNameChanged',
//         birthday: '2018-02-15T23:00:00.000Z',
//       };
//
//       const userInfo = await UserCtrl.update(this.user1, params);
//
//       await this.user1.reload();
//
//       expect(userInfo.firstName).eq('firstnamechanged');
//       expect(userInfo.lastName).eq('lastnamechanged');
//       expect(userInfo.birthday).to.exist;
//
//       expect(this.user1.firstName).eq('firstnamechanged');
//       expect(this.user1.lastName).eq('lastnamechanged');
//       expect(this.user1.birthday).to.exist;
//
//     });
//
//     it('Should lowercase email', async () => {
//
//       const rawUser = {
//         firstName: 'firstName1',
//         lastName: 'lastName1',
//         email: 'Bobychou@email.com',
//         password: 'pass1',
//       };
//
//       const user = await UserCtrl.create(rawUser);
//
//       expect(this.sendActivateAccountMail.calledOnce).to.be.true;
//       expect(this.sendActivateAccountMail.args[0][0].email).to.eq(rawUser.email);
//       expect(user.email).eq('bobychou@email.com');
//
//     });
//
//     it('Should throw bad_params fails update user', async () => {
//
//       const params = {
//         firstName: 'firstNameChanged',
//         lastName: 'lastNameChanged'
//       };
//
//       sandbox.stub(this.user1, 'update').rejects(new Error('fake-error'));
//
//       await expect(UserCtrl.update(this.user1, params)).to.be.rejectedWith(Error, 'bad_params');
//
//     });
//
//     it('Should throw bad_params', async () => {
//
//       const params = {};
//
//       await expect(UserCtrl.update(this.user1, params)).to.be.rejectedWith(Error, 'bad_params');
//
//     });
//
//   });
//
//   describe('With user', () => {
//
//     beforeEach(async () => {
//
//       this.rawUser = {
//         firstName: 'firstName',
//         lastName: 'lastName',
//         email: 'alfredo@email.com',
//         password: 'pass1',
//         isActive: true,
//         isVerify: true,
//       };
//
//       this.rawDemoUser = {
//         firstName: 'firstName2',
//         lastName: 'lastName2',
//         email: 'marco@amon.tech',
//         password: 'pass1',
//         isActive: true,
//         isVerify: true,
//       };
//
//       this.user = await UserModel.create(this.rawUser);
//       this.demoUser = await UserModel.create(this.rawDemoUser);
//       this.token2faEmail = await TokenModel.createFor2FAEmail(this.user);
//
//     });
//
//     it('Should login ignoring fake demo account', async () => {
//
//       config.DEMO_ACCOUNT = this.demoUser.email;
//       const stubGetCAPublicKey = sandbox.stub(AppleHelper, 'getCAPublicKey')
//
//       await expect(UserCtrl.login({
//         email: 'fake-email',
//         password: 'any',
//       })).rejectedWith(Error, 'bad_credentials');
//       expect(stubGetCAPublicKey.notCalled).to.be.true;
//
//     });
//
//     it('Should login', async () => {
//
//       const stubGetCAPublicKey = sandbox.stub(AppleHelper, 'getCAPublicKey')
//       const requestInfo = {ip: '1.1.1.1'};
//       const {user, token} = await UserCtrl.login({
//         email: this.rawUser.email,
//         password: this.rawUser.password,
//         requestInfo,
//       });
//
//       expect(this.sendLoginMail.args[0][0]._id.toString()).to.eq(this.user._id.toString());
//       expect(this.sendLoginMail.args[0][1]).to.eq(requestInfo);
//       expect(user._id.toString()).to.eq(this.user._id.toString());
//       expect(token.length).to.eq(200);
//       expect(stubGetCAPublicKey.notCalled).to.be.true;
//
//     });
//
//     it('Should login with apple token', async () => {
//
//       const applePayload = {
//         email: this.user.email,
//       };
//       const appleToken = 'eyJraWQiOiJlWGF1bm1MIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL2FwcGxlaWQuYXBwbGUuY29tIiwiYXVkIjoiZGV2LmF2dm9jYXRvZmxhc2gubGF3eWVyIiwiZXhwIjoxNjM1ODcwMTA0LCJpYXQiOjE2MzU3ODM3MDQsInN1YiI6IjAwMDcyNy43NTY3NmE1YzlkOWQ0Y2ZjODBiNDNmMTA4YzU1ZDE1Yy4xMjUyIiwibm9uY2UiOiJub25jZSIsImNfaGFzaCI6ImZQTHdiYlRxNUsySFYwZU9FQ1dyRGciLCJlbWFpbCI6ImRpbWF0aWt2YUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6InRydWUiLCJhdXRoX3RpbWUiOjE2MzU3ODM3MDQsIm5vbmNlX3N1cHBvcnRlZCI6dHJ1ZSwicmVhbF91c2VyX3N0YXR1cyI6Mn0.4IzM0PZ8b9X31a6q9_uYVaiIuX291msFWzezPRg0d6I2Te';
//
//       const stubGetCAPublicKey = sandbox.stub(AppleHelper, 'getCAPublicKey').resolves('xxx');
//       const stubVerifyAppleIdentity = sandbox.stub(AppleHelper, 'verifyAppleIdentity').resolves(true);
//       const stubGetIdentity = sandbox.stub(AppleHelper, 'getIdentity').resolves(applePayload);
//
//       const requestInfo = {ip: '1.1.1.1'};
//       const {user, token} = await UserCtrl.login({
//         appleToken,
//         requestInfo,
//       });
//
//       expect(this.sendLoginMail.args[0][0]._id.toString()).to.eq(this.user._id.toString());
//       expect(this.sendLoginMail.args[0][1]).to.eq(requestInfo);
//       expect(user._id.toString()).to.eq(this.user._id.toString());
//       expect(token.length).to.eq(200);
//       expect(stubGetCAPublicKey.calledWith(appleToken)).to.be.true;
//       expect(stubVerifyAppleIdentity.calledWith(appleToken, 'xxx')).to.be.true;
//       expect(stubGetIdentity.calledWith(appleToken)).to.be.true;
//
//     });
//
//     it('Should login demo account', async () => {
//
//       config.DEMO_ACCOUNT = this.demoUser.email;
//       const stubGetCAPublicKey = sandbox.stub(AppleHelper, 'getCAPublicKey')
//
//       const {user, token} = await UserCtrl.login({
//         email: this.demoUser.email,
//         password: this.rawDemoUser.password,
//       });
//
//       expect(this.sendLoginMail.notCalled).to.be.true;
//       expect(user._id.toString()).to.eq(this.demoUser._id.toString());
//       expect(token.length).to.eq(200);
//       expect(stubGetCAPublicKey.notCalled).to.be.true;
//
//     });
//
//     it('Should throw error if fake acccount password wrong', async () => {
//
//       config.DEMO_ACCOUNT = this.demoUser.email;
//       const stubGetCAPublicKey = sandbox.stub(AppleHelper, 'getCAPublicKey')
//
//       await expect(UserCtrl.login({
//         email: 'fake email',
//         password: 'any-pwd',
//       })).rejectedWith(Error, 'bad_credentials');
//       expect(stubGetCAPublicKey.notCalled).to.be.true;
//
//     });
//
//     it('Should login with ip', async () => {
//
//       const stubGetCAPublicKey = sandbox.stub(AppleHelper, 'getCAPublicKey')
//       const requestInfo = {ip: '1.1.1.1'};
//       const {user} = await UserCtrl.login({
//         email: this.rawUser.email,
//         password: this.rawUser.password,
//         requestInfo,
//       });
//
//       expect(this.sendLoginMail.args[0][0]._id.toString()).to.eq(this.user._id.toString());
//       expect(this.sendLoginMail.args[0][1]).to.eq(requestInfo);
//       expect(user.email).to.eq(this.rawUser.email);
//       expect(stubGetCAPublicKey.notCalled).to.be.true;
//
//     });
//
//     it('Should login with higher case email', async () => {
//
//       this.rawUser.email = 'ALfredo@email.com';
//
//       const {user} = await UserCtrl.login({
//         email: this.rawUser.email,
//         password: this.rawUser.password,
//       });
//
//       this.rawUser.email = 'alfredo@email.com';
//
//       expect(user.email).to.eq(this.rawUser.email);
//
//     });
//
//     it('Cannot login if user not found', async () => {
//
//       await expect(UserCtrl.login({
//         email: 'not-exist-email',
//         password: this.rawUser.password,
//       })).be.rejectedWith(Error, 'bad_credentials');
//
//     });
//
//     it('Cannot login is incorrect password', async () => {
//
//       await expect(UserCtrl.login({
//         email: this.rawUser.email,
//         password: 'incorrect pass',
//       })).be.rejectedWith(Error, 'bad_credentials');
//
//     });
//
//     it('Cannot login if user not active', async () => {
//
//       const rawUser = {
//         firstName: 'firstName11',
//         lastName: 'lastName11',
//         email: '11@email.com',
//         password: 'pass11',
//         isActive: false,
//       };
//
//       await UserModel.create(rawUser);
//
//       await expect(UserCtrl.login({
//         email: rawUser.email,
//         password: rawUser.password,
//       })).be.rejectedWith(Error, 'disabled_account');
//
//     });
//
//     it('Should logout', async () => {
//
//       const token = await TokenModel.create({
//         value: 'auth-token',
//         type: TokenModel.TYPE.AUTH,
//         User: this.user._id
//       });
//
//       const res = await UserCtrl.logout(this.user, token);
//       const tokens = await this.user.getTokensByType(TokenModel.TYPE.AUTH);
//
//       expect(res).to.be.true;
//       expect(tokens.length).to.eq(0);
//
//     });
//
//     it('Cannot validate email if user not active', async () => {
//
//       const rawUser = {
//         firstName: 'firstName11',
//         lastName: 'lastName11',
//         email: '11@email.com',
//         password: 'pass11',
//         isActive: false,
//       };
//
//       const user = await UserModel.create(rawUser);
//
//       await expect(UserCtrl.validateEmail(user, 'fdsfd')).be.rejectedWith(Error, 'disabled_account');
//
//     });
//
//     it('Cannot validate email if token not found', async () => {
//
//       const rawUser = {
//         firstName: 'firstName11',
//         lastName: 'lastName11',
//         email: '11@email.com',
//         password: 'pass11',
//         isActive: true,
//       };
//
//       const user = await UserModel.create(rawUser);
//
//       sandbox.stub(user, 'getTokensByType').resolves(false);
//
//       await expect(UserCtrl.validateEmail(user, 'fdsfd')).be.rejectedWith(Error, 'token_not_found');
//
//     });
//
//     it('Cannot validate email if pin invalid', async () => {
//
//       const rawUser = {
//         firstName: 'firstName11',
//         lastName: 'lastName11',
//         email: '11@email.com',
//         password: 'pass11',
//       };
//
//       const user = await UserCtrl.create(rawUser);
//
//       await expect(UserCtrl.validateEmail(user, 'invalid-pin-code')).be.rejectedWith(Error, 'invalid_token');
//
//     });
//
//     it('Cannot double validate email', async () => {
//
//       await expect(UserCtrl.validateEmail(this.user, 'fdsfdsf')).be.rejectedWith(Error, 'bad_request');
//
//     });
//
//     it('Should resend validate email', async () => {
//
//       const rawUser = {
//         firstName: 'firstName11',
//         lastName: 'lastName11',
//         email: '11@email.com',
//         password: 'pass11',
//         isActive: true,
//       };
//
//       const user = await UserCtrl.create(rawUser);
//       const res = await UserCtrl.reSendValidateEmail(user);
//
//       expect(res).to.be.true;
//       expect(this.sendActivateAccountMail.args[0][0]._id.toString()).to.eq(user._id.toString());
//
//     });
//
//     it('Cannot resend validate email if user not active', async () => {
//
//       const rawUser = {
//         firstName: 'firstName11',
//         lastName: 'lastName11',
//         email: '11@email.com',
//         password: 'pass11',
//         active: false,
//       };
//
//       const user = await UserModel.create(rawUser);
//
//       await expect(UserCtrl.reSendValidateEmail(user)).be.rejectedWith(Error, 'disabled_account');
//
//     });
//
//     it('Cannot resend validate email if user haven\'t key', async () => {
//
//       const rawUser = {
//         firstName: 'firstName11',
//         lastName: 'lastName11',
//         email: '11@email.com',
//         password: 'pass11',
//         isActive: true,
//       };
//
//       const user = await UserModel.create(rawUser);
//
//       await expect(UserCtrl.reSendValidateEmail(user)).to.be.rejectedWith(Error, 'token_not_found');
//
//     });
//
//     it('Cannot resend validate email if already verify', async () => {
//
//       await expect(UserCtrl.reSendValidateEmail(this.user)).be.rejectedWith(Error, 'bad_request');
//
//     });
//
//     it('Cannot change password if old password incorrect', async () => {
//
//       await expect(UserCtrl.changePassword(this.user, {
//         oldPassword: 'wrong password',
//         newPassword: 'newPassword'
//       })).be.rejectedWith(Error, 'bad_credentials');
//
//     });
//
//     it('Cannot change password if old password and new are same', async () => {
//
//       await expect(UserCtrl.changePassword(this.user, {
//         oldPassword: this.rawUser.password,
//         newPassword: this.rawUser.password
//       })).to.be.rejectedWith(Error, 'password_should_be_different');
//
//     });
//
//     it('Should change password', async () => {
//
//       const stubRemoveTokensByType = sandbox.stub(UserModel.prototype, 'removeTokensByType').resolves('ok');
//
//       const newPassword = 'newPassword';
//
//       const res = await UserCtrl.changePassword(this.user, {
//         oldPassword: this.rawUser.password,
//         newPassword
//       });
//
//       expect(res).to.eq(true);
//       expect(stubRemoveTokensByType.callCount).to.eq(4);
//       expect(stubRemoveTokensByType.calledWith(TokenModel.TYPE.RESET_PASSWORD)).to.be.true;
//       expect(stubRemoveTokensByType.calledWith(TokenModel.TYPE.TWO_FACTOR_EMAIL)).to.be.true;
//       expect(stubRemoveTokensByType.calledWith(TokenModel.TYPE.CHANGE_EMAIL)).to.be.true;
//       expect(stubRemoveTokensByType.calledWith(TokenModel.TYPE.AUTH)).to.be.true;
//       expect(this.sendPassChangedMail.calledOnce).to.be.true;
//
//       const {user} = await UserCtrl.login({
//         email: this.rawUser.email,
//         password: newPassword,
//         twoFaCode: this.token2faEmail.value
//       });
//
//       expect(user.email).to.eq(this.rawUser.email);
//
//     });
//
//     it('Should send reset password mail', async () => {
//
//       const token = {
//         token: 'tokenId',
//       };
//       const createForResetPassword = sandbox.stub(TokenModel, 'createForResetPassword').resolves(token);
//
//       const res = await UserCtrl.askResetPassword(this.user.email);
//
//       expect(res).to.eq(true);
//       expect(createForResetPassword.args[0][0].id).to.eq(this.user.id);
//       expect(this.sendResetPasswordMail.args[0][0].id).to.eq(this.user.id);
//       expect(this.sendResetPasswordMail.args[0][1]).to.eq(token.value);
//
//     });
//
//     it('Should send reset password mail with upper case email', async () => {
//
//       const token = {
//         token: 'tokenId',
//       };
//       const createForResetPassword = sandbox.stub(TokenModel, 'createForResetPassword').resolves(token);
//
//       const res = await UserCtrl.askResetPassword('Alfredo@Email.Com');
//
//       expect(res).to.eq(true);
//       expect(createForResetPassword.args[0][0].id).to.eq(this.user.id);
//       expect(this.sendResetPasswordMail.args[0][0].id).to.eq(this.user.id);
//       expect(this.sendResetPasswordMail.args[0][1]).to.eq(token.value);
//
//     });
//
//     it('Should return true if user not exist', async () => {
//
//       const resp = await UserCtrl.askResetPassword('invalid@email.com');
//       expect(resp).to.be.true;
//
//     });
//
//     it('Should send not reset password mail if user not active', async () => {
//
//       await this.user.update({isActive: false});
//
//       await expect(UserCtrl.askResetPassword(this.user.email)).to.be.rejectedWith(Error, 'disabled_account');
//
//     });
//
//     it('Should reset password', async () => {
//
//       const stubRemoveTokensByType = sandbox.stub(UserModel.prototype, 'removeTokensByType').resolves('ok');
//
//       await UserCtrl.askResetPassword(this.user.email);
//       const token = this.sendResetPasswordMail.args[0][1];
//
//       const newPassword = 'ifijfeizjfze';
//
//       const res = await UserCtrl.resetPassword({token, newPassword});
//       expect(res).to.eq(true);
//
//       const tokenDb = await TokenModel.findByValue(token);
//       expect(tokenDb).not.to.exist;
//
//       expect(stubRemoveTokensByType.callCount).to.eq(5);
//       expect(stubRemoveTokensByType.calledWith(TokenModel.TYPE.RESET_PASSWORD)).to.be.true;
//       expect(stubRemoveTokensByType.calledWith(TokenModel.TYPE.TWO_FACTOR_EMAIL)).to.be.true;
//       expect(stubRemoveTokensByType.calledWith(TokenModel.TYPE.CHANGE_EMAIL)).to.be.true;
//       expect(stubRemoveTokensByType.calledWith(TokenModel.TYPE.AUTH)).to.be.true;
//       expect(this.sendPassChangedMail.calledOnce).to.be.true;
//
//       const {user} = await UserCtrl.login({
//         email: this.user.email,
//         password: newPassword,
//         twoFaCode: this.token2faEmail.value
//       });
//       expect(user.email).to.eq(this.user.email);
//
//     });
//
//     it('Should not reset password for wrong token', async () => {
//
//       const tokendb = await TokenModel.create({
//         value: 'fiefiojsd',
//         type: TokenModel.TYPE.VERIFY_EMAIL,
//         User: this.user._id
//       });
//
//       const token = 'fqdsgdsqg';
//       const newPassword = 'ifijfeizjfze';
//       await expect(UserCtrl.resetPassword({token: null, newPassword})).to.be.rejectedWith(Error, 'bad_request');
//       await expect(UserCtrl.resetPassword({token, newPassword: null})).to.be.rejectedWith(Error, 'bad_request');
//       await expect(UserCtrl.resetPassword({
//         token: tokendb.value,
//         newPassword
//       })).to.be.rejectedWith(Error, 'invalid_token');
//
//     });
//
//     it('Should ask change email', async () => {
//
//       const stubTokenChangeEmail = sandbox.stub(TokenModel, 'createForChangeEmail').resolves({
//         value: 'tok'
//       });
//
//       const sendEmailChanged = sandbox.stub(notification, 'askChangeEmail').resolves();
//
//       await UserCtrl.askChangeEmail(this.user, 'new@email.com');
//
//       expect(stubTokenChangeEmail.args[0][0].email).to.eq(this.user.email);
//       expect(stubTokenChangeEmail.args[0][1]).to.eq('new@email.com');
//
//       expect(sendEmailChanged.calledOnce).to.be.true;
//       expect(sendEmailChanged.args[0][0].email).to.eq(this.user.email);
//       expect(sendEmailChanged.args[0][1]).to.eq('new@email.com');
//       expect(sendEmailChanged.args[0][2]).to.eq('tok');
//
//     });
//
//     it('Should ask change email error bad params', async () => {
//
//       await expect(UserCtrl.askChangeEmail(this.user, this.user.email)).rejectedWith(Error, 'bad_request');
//
//     });
//
//     it('Should ask change email error disabled account', async () => {
//
//       await this.user.update({
//         isActive: false
//       });
//
//       await expect(UserCtrl.askChangeEmail(this.user, this.user.email)).rejectedWith(Error, 'disabled_account');
//
//     });
//
//     it('Should change email', async () => {
//
//       const sendChangeEmail = sandbox.stub(notification, 'askChangeEmail').resolves();
//       const sendEmailChanged = sandbox.stub(notification, 'emailChanged').resolves();
//
//       await UserCtrl.askChangeEmail(this.user, 'new@email.com');
//
//       const token = sendChangeEmail.args[0][2];
//       const stubRemoveTokensByType = sandbox.stub(UserModel.prototype, 'removeTokensByType').resolves('ok');
//
//       const res = await UserCtrl.changeEmail(token);
//       expect(res).to.eq(true);
//
//       const tokenDb = await TokenModel.findByValue(token);
//       expect(tokenDb).not.to.exist;
//
//       expect(sendEmailChanged.calledOnce).to.be.true;
//
//       const reloadUser = await this.user.reload();
//       expect(reloadUser.email).to.eq('new@email.com');
//
//       expect(stubRemoveTokensByType.callCount).to.eq(4);
//       expect(stubRemoveTokensByType.calledWith(TokenModel.TYPE.RESET_PASSWORD)).to.be.true;
//       expect(stubRemoveTokensByType.calledWith(TokenModel.TYPE.TWO_FACTOR_EMAIL)).to.be.true;
//       expect(stubRemoveTokensByType.calledWith(TokenModel.TYPE.CHANGE_EMAIL)).to.be.true;
//       expect(stubRemoveTokensByType.calledWith(TokenModel.TYPE.AUTH)).to.be.true;
//
//     });
//
//   });
//
//   describe('Upload Image', () => {
//
//     it('Should upload image', async () => {
//
//       const rawUser = {
//         firstName: 'firstName1',
//         lastName: 'lastName1',
//         email: '1@email.com',
//         save: sandbox.stub().resolves()
//       };
//
//       const params = {
//         user: rawUser,
//         filePath: '/fake-path',
//       };
//
//       const stubImageAdminDelete = sandbox.stub(ImageAdminCtrl, 'delete');
//       const stubImageAdminCreate = sandbox.stub(ImageAdminCtrl, 'create').resolves({_id: '58f8403bbe7bc800044ba7d2'});
//
//       const result = await UserCtrl.uploadImage(params);
//
//       expect(result).to.be.true;
//       expect(stubImageAdminDelete.notCalled).to.be.true;
//       expect(stubImageAdminCreate.calledOnce).to.be.true;
//       expect(stubImageAdminCreate.calledWith({
//         filePath: params.filePath,
//         type: ImageModel.TYPE.IMAGE,
//         title: `${rawUser.firstName} ${rawUser.lastName}`,
//         alt: `${rawUser.firstName} ${rawUser.lastName}`,
//       })).to.be.true;
//
//     });
//
//     it('Should upload replace existing image', async () => {
//
//       const image = {
//         _id: 'xxx',
//       };
//
//       const rawUser = {
//         firstName: 'firstName1',
//         lastName: 'lastName1',
//         email: '1@email.com',
//         Image: image,
//         save: sandbox.stub().resolves()
//       };
//
//       const params = {
//         user: rawUser,
//         filePath: '/fake-path',
//       };
//
//       const stubImageAdminDelete = sandbox.stub(ImageAdminCtrl, 'delete');
//       const stubImageAdminCreate = sandbox.stub(ImageAdminCtrl, 'create').resolves({_id: '58f8403bbe7bc800044ba7d2'});
//
//       const result = await UserCtrl.uploadImage(params);
//
//       expect(result).to.be.true;
//       expect(stubImageAdminDelete.calledOnce).to.be.true;
//       expect(stubImageAdminDelete.calledWith(image._id)).to.be.true;
//
//       expect(stubImageAdminCreate.calledOnce).to.be.true;
//       expect(stubImageAdminCreate.calledWith({
//         filePath: params.filePath,
//         type: ImageModel.TYPE.IMAGE,
//         title: `${rawUser.firstName} ${rawUser.lastName}`,
//         alt: `${rawUser.firstName} ${rawUser.lastName}`,
//       })).to.be.true;
//
//     });
//
//     it('Should throw error delete image', async () => {
//
//       const image = {
//         _id: 'xxx',
//       };
//
//       const rawUser = {
//         firstName: 'firstName1',
//         lastName: 'lastName1',
//         email: '1@email.com',
//         Image: image,
//         save: sandbox.stub().resolves()
//       };
//
//       const params = {
//         user: rawUser,
//         filePath: '/fake-path',
//       };
//
//       sandbox.stub(ImageAdminCtrl, 'delete').rejects(new Error('fake-error'));
//       await expect(UserCtrl.uploadImage(params)).rejectedWith(Error, 'upload_image_fail');
//
//     });
//
//   });
//
// });
//
