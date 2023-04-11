class CustomErrorHandler extends Error {

    constructor(status, msg)  {
        super();
        this.status = status;
        this.message = msg;
    }
  
    static alreadyExist(message) {
        return new CustomErrorHandler(409, message);
    }
  
    static wrongCredential(message = 'Username or pasword is wrong') {
        return new CustomErrorHandler(401, message); //401 Unauthorized
    }
  
    static unAuthorized(message = 'UnAuthorized') {
        return new CustomErrorHandler(401, message); //401 Unauthorized
    }
  
    
    static notFound(message = '404 Note Found') {
        return new CustomErrorHandler(404, message); //401 Unauthorized
    }
  
    static serverError(message = 'Internal server error') {
        return new CustomErrorHandler(500, message); //401 Unauthorized
    }
  }
  
  export default CustomErrorHandler