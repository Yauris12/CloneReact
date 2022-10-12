import CustomAPIError from './custom-api.js'

CustomAPIError
class UnAuthenticatedError extends CustomAPIError {
  constructor(message) {
    super(message)
    this.statusCode = 401
  }
}

export default UnAuthenticatedError
