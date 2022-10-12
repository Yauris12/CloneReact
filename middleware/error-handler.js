const errorHandlerMiddleware = (error, req, res, next) => {
  console.log(error.message)

  const defaultError = {
    statusCode: error.statusCode || 500,
    msg: error.message || 'Algo salió mal, inténtalo de nuevo más tarde',
  }

  if (error.name === 'ValidationError') {
    defaultError.statusCode = 400
    // defaultError.msg = error.message

    defaultError.msg = Object.values(error.errors)
      .map((item) => item.message)
      .join(',')
  }
  if (error.code && error.code === 11000) {
    defaultError.statusCode = 400
    defaultError.msg = `El campo ${Object.keys(
      error.keyValue
    )} tiene que ser unico`
  }
  // res.status(defaultError.statusCode).json({ msg: error.msg })
  res.status(defaultError.statusCode).json({ msg: defaultError.msg })
}

export default errorHandlerMiddleware
