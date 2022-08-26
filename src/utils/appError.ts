class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  constructor(message, statusCode) {
    super(message); // calling constructor of parent class

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // all errors get this property set to true ; we can then test for this property and only send back error messages to the client for these operational errors that we created using this class

    Error.captureStackTrace(this, this.constructor); // when a new object is created, and a constructor function is called, then that function call is not gonna appear in ths taack trace and will not popllute it
  }
}

export default AppError;
