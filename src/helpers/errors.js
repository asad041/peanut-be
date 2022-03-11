const throwError = (message, detail) => {
  const err = new Error(message);

  Object.assign(err, detail);

  throw err;
};

const throwExposable = (code, status, description, exposeMeta) => {
  const error = getError(code);
  if (!error) {
    throwError('unknown_error_code', {
      code,
      status,
      description,
      exposeMeta,
    });
  }
  const err = new Error(code);
  err.exposeCustom_ = true;

  err.status = status || error.status;
  err.description = description || error.description;

  if (exposeMeta) {
    err.exposeMeta = exposeMeta;
  }

  throw err;
};

function castExposable(error) {
  if (error.exposeCustom_) throw error;

  throwExposable(error.message, error.status, error.description);
}

function getError(errorCode) {
  const code = ERRORS[errorCode];
  if (!errorCode || !code) {
    return null;
  }
  return code;
}

function assert(condition, ...args) {
  if (!condition) {
    throwError(...args);
  }
}

function assertExposable(condition, ...args) {
  if (!condition) {
    throwExposable(...args);
  }
}

function bodyParserError(error) {
  if (error.type === 'entity.too.large') {
    throwExposable('entity_too_large');
  } else {
    throwExposable('bad_params', null, error.message);
  }
}

const ERRORS = {
  too_busy: {
    status: 503,
    description: 'Server too busy',
  },
  unknown_error: {
    status: 500,
    description: 'Unknown error',
  },
  not_implemented: {
    status: 501,
    description: 'Not implemented',
  },
  entity_too_large: {
    status: 413,
    description: 'The files you are trying to upload are too big',
  },
  method_not_allowed: {
    status: 405,
    description: 'The action you want to do is not allowed',
  },
  notification_not_found: {
    status: 404,
    description: 'Notification not found.',
  },
  wallet_not_found: {
    status: 404,
    description: 'Wallet not found.',
  },
  image_not_found: {
    status: 404,
    description: 'Image not found.',
  },
  not_found: {
    status: 404,
    description: 'Not found',
  },
  not_found_content: {
    status: 404,
    description: 'Not found',
  },
  user_not_found: {
    status: 404,
    description: 'User not found.',
  },
  demo_account: {
    status: 404,
    description: 'resource is not available with the demo account',
  },
  transaction_not_found: {
    status: 404,
    description: 'Transaction not found.',
  },
  token_not_found: {
    status: 404,
    description: 'Token not found.',
  },
  unknown_coin_code: {
    status: 404,
    description: 'Could not find coin with the given coin code',
  },
  invalid_origin: {
    status: 403,
    description: 'Origin not allowed',
  },
  access_denied: {
    status: 401,
    description: 'Access to a forbidden resource',
  },
  token_expired: {
    status: 401,
    description: 'This token is expired',
  },
  bad_credentials: {
    status: 401,
    description: 'Bad credentials',
  },
  two_factor_token_required: {
    status: 401,
    description:
      'This account has enabled two-factor authentication and the token is required',
  },
  two_factor_token_invalid: {
    status: 401,
    description: 'The two-factor token you provided is invalid',
  },
  image_invalid_path: {
    status: 401,
    description: 'Path image is invalid',
  },
  image_upload_fails: {
    status: 401,
    description: 'Upload Image fails',
  },
  image_destroy_fails: {
    status: 401,
    description: 'Destroy image fails',
  },
  bad_params: {
    status: 400,
    description: 'Bad parameters',
  },
  upload_image_fail: {
    status: 400,
    description: 'Upload image fail',
  },
  bad_request: {
    status: 400,
    description: 'Bad request',
  },
  password_should_be_different: {
    status: 400,
    description: 'Old and new password should be different',
  },
  already_exists: {
    status: 400,
    description: 'Entity already exists',
  },
  disabled_account: {
    status: 400,
    description: 'Account is disabled',
  },
  user_not_exists: {
    status: 400,
    description: 'User not found.',
  },
  invalid_token: {
    status: 400,
    description: 'The token you are trying to use is not valid',
  },
  signup_disabled: {
    status: 400,
    description: 'Signup is currently disabled',
  },
  enable_2fa: {
    status: 400,
    description: 'You need enable 2fa for access to this resource',
  },
  signature_mismatched: {
    status: 400,
    description: 'cannot verify signature',
  },
  already_coin_exists: {
    status: 400,
    description: 'Coin entity already exists',
  },
};

module.exports = {
  throwError,
  throwExposable,
  bodyParserError,
  assert,
  assertExposable,
  castExposable,
  ERRORS,
};

/****
 HTTP ERROR CODES

 100 "continue"
 101 "switching protocols"
 102 "processing"
 200 "ok"
 201 "created"
 202 "accepted"
 203 "non-authoritative information"
 204 "no content"
 205 "reset content"
 206 "partial content"
 207 "multi-status"
 208 "already reported"
 226 "im used"
 300 "multiple choices"
 301 "moved permanently"
 302 "found"
 303 "see other"
 304 "not modified"
 305 "use proxy"
 307 "temporary redirect"
 308 "permanent redirect"
 400 "bad request"
 401 "unauthorized"
 402 "payment required"
 403 "forbidden"
 404 "not found"
 405 "method not allowed"
 406 "not acceptable"
 407 "proxy authentication required"
 408 "request timeout"
 409 "conflict"
 410 "gone"
 411 "length required"
 412 "precondition failed"
 413 "payload too large"
 414 "uri too long"
 415 "unsupported media type"
 416 "range not satisfiable"
 417 "expectation failed"
 418 "I'm a teapot"
 422 "unprocessable entity"
 423 "locked"
 424 "failed dependency"
 426 "upgrade required"
 428 "precondition required"
 429 "too many requests"
 431 "request header fields too large"
 500 "internal server error"
 501 "not implemented"
 502 "bad gateway"
 503 "service unavailable"
 504 "gateway timeout"
 505 "http version not supported"
 506 "variant also negotiates"
 507 "insufficient storage"
 508 "loop detected"
 510 "not extended"
 511 "network authentication required"
 */
