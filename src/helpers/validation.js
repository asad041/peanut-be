const Joi = require('@hapi/joi');
const {throwExposable} = require('./errors');

module.exports = {

  Joi,
  joiUuid: Joi.string().regex(/^[0-9a-fA-F]{24}$/),

  async validateParams(schema, params) {

    try {

      const res = await schema.validateAsync(params, {presence: 'required'});

      return res;

    } catch (error) {

      const validationError = {
        params,
        errors: error.details.map(detail => detail.message),
      };

      if (validationError.params.password) {

        delete validationError.params.password;

      }

      throwExposable('bad_params', null, null, {
        validationError,
      });

    }

  },

};
