const sinon = require('sinon');
const path = require('path');
const Joi = require('@hapi/joi');
const Validation = require(path.join(srcDir, '/helpers/validation') );

describe('Helpers: Validation', () => {

  let sandbox = null;

  beforeEach( () => {

    sandbox = sinon.createSandbox();

  });

  afterEach( () => {

    sandbox && sandbox.restore();

  });

  describe('Custom schema', () => {

    it('joiUuid', async () => {

      const uuid = '5d5a111b29ab354952b1543d';

      const res = await Validation.joiUuid.validateAsync(uuid);
      expect(res).to.eq(uuid);

      await expect(Validation.joiUuid
        .validateAsync('5d5a111b294952b1543d') )
        .to.be.rejectedWith(Error, '"value" with value "5d5a111b294952b1543d" fails to match the required pattern: /^[0-9a-fA-F]{24}$/');

    });

  });

  describe('Validate schema', () => {

    it('Should validate params', async () => {

      const schema = Joi.object({
        num: Joi.number().integer(),
        str: Joi.string(),
      });

      const res = await Validation.validateParams(
        schema,
        {
          num: 1,
          str: 'str1'
        }
      );

      expect(res.num).to.eq(1);
      expect(res.str).to.eq('str1');

    });

    it('Should validate params throw nice error', async () => {

      const schema = Joi.object({
        age: Joi.number(),
        date: Joi.date(),
      });
      const params = {
        date: 14,
        age: 'fsdqf'
      };

      let isThrowing = false;

      try {

        await Validation.validateParams(schema, params);

      } catch(error) {

        isThrowing = true;
        expect(error.message).to.eq('bad_params');
        expect(error.exposeMeta.validationError.params.date).to.eq(params.date);
        expect(error.exposeMeta.validationError.params.age).to.eq(params.age);
        expect(error.exposeMeta.validationError.errors.length).to.eq(1);
        expect(error.exposeMeta.validationError.errors[0]).to.eq('"age" must be a number');

      }

      expect(isThrowing).to.be.true;

    });

    it('Should validate params throw nice error remove password params value', async () => {

      const schema = Joi.object({
        age: Joi.number(),
        date: Joi.date(),
        password: Joi.string(),
      });
      const params = {
        date: 14,
        age: 'fsdqf',
        password: 'fsdqf',
      };

      let isThrowing = false;

      try {

        await Validation.validateParams(schema, params);

      } catch(error) {

        isThrowing = true;
        expect(error.message).to.eq('bad_params');
        expect(error.exposeMeta.validationError.params.date).to.eq(params.date);
        expect(error.exposeMeta.validationError.params.age).to.eq(params.age);
        expect(error.exposeMeta.validationError.params.password).not.to.exist;
        expect(error.exposeMeta.validationError.errors.length).to.eq(1);
        expect(error.exposeMeta.validationError.errors[0]).to.eq('"age" must be a number');

      }

      expect(isThrowing).to.be.true;

    });

  });

});
