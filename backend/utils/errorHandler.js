// import ErrorHandler from "@backend/utils/errorHandler";
const errors = (err, status, res) => {
  err.message = err.message || "internal server error";

  // _____________________________
  // url path id error
  if (err.name === "CastError") {
    err.message = `This Resource Is Not Exist: ${err.path}`;
  }

  // _____________________________
  // duplicate email error
  if (err.code === 11000) {
    err.message = `User with this id already exists in our data: `;
  }
  if (err.type === "entity.parse.failed") {
    err.message = "please The value you entered cannot be accepted price";
  }

  // wrong jwt error
  else if (err.name === "JsonWebTokenError") {
    err.message = `token is invalid`;
  }
  // jwt expire error
  else if (err.name === "TokenExpiredError") {
    err.message = `token is expired`;
  }
  // _____________________________
  // validation error --Reasons for not providing required value
  // if (err.name === "ValidationError") {
  //   err = new ErrorHandler(err.message, 400);
  // }
  // _____________________________
  const send = {
    success: false,
    message: err.message,
  };
  return res
    ? res.status(status).json(send)
    : new Response(JSON.stringify(send), {
        status,
      });
};
export default errors;
