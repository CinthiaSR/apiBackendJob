// eslint-disable-next-line no-unused-vars, no-shadow

export class AuthErrorHandler extends Error {
  constructor(status, msg) {
    super();
    this.status = status;
    this.message = msg;
  }

  static wrongCredentials(message = 'Wrong credentials, check your email/password') {
    return new AuthErrorHandler(401, message); //401 Wrong Credentials
  }

  static unAuthorized(message = 'Unauthorized, check your authorization token') {
    return new AuthErrorHandler(403, message); //403 Unauthorized
  }
}



export default function errorHandler(err, req, res, next) {
  const errors = err.errors || [{ message: err.message }];
  res.status(err.status || 500).json({ errors });
}
