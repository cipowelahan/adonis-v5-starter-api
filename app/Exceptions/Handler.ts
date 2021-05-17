/*
|--------------------------------------------------------------------------
| Http Exception Handler
|--------------------------------------------------------------------------
|
| AdonisJs will forward all exceptions occurred during an HTTP request to
| the following class. You can learn more about exception handling by
| reading docs.
|
| The exception handler extends a base `HttpExceptionHandler` which is not
| mandatory, however it can do lot of heavy lifting to handle the errors
| properly.
|
*/

import Logger from '@ioc:Adonis/Core/Logger'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor () {
    super(Logger)
  }

  public async handle(error, ctx: HttpContextContract) {
    const { response } = ctx

    if (error.code === 'E_VALIDATION_FAILURE') {
      return response.sendError(error.messages.errors, "Invalid Validation", 422)
    }
    else if (error.code === 'E_ROUTE_NOT_FOUND') {
      return response.sendError([], "Route Not Found", 404)
    }
    else if (error.code === 'E_ROW_NOT_FOUND') {
      return response.sendError([], "Row Not Found", 404)
    }
    else if (error.code === 'E_UNAUTHORIZED_ACCESS') {
      return response.sendError([], "Unauthorized Access", 401)
    }
    else if (error.code === 'E_NOTACCAPTABLE_ACCESS') {
      return response.sendError([], "Not Accaptable Access", 403)
    }
    else if (error.code === 'E_INVALID_AUTH_UID' || error.code === 'E_INVALID_AUTH_PASSWORD') {
      return response.sendError([], "Invalid Credential", 400)
    }

    return super.handle(error, ctx)
  }
}
