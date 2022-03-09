module.exports = () => async (ctx, next) => {

  try {

    await next();

  } catch(error) {

    ctx.requestInfo.error = error;

    let status = 500;
    const response = {
      code: 'unknown_error',
      description: 'Internal server error',
    };

    if(error.exposeCustom_) {

      status = error.status || 500;
      response.code = error.message || 'unknown_error';

      if(error.description) {
        response.description = error.description;
      }
      if(error.exposeMeta) {
        response.meta = error.exposeMeta;
      }

    }

    ctx.status = status;
    ctx.body = response;

  }

};
