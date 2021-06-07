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
import { EXCEPTION_CODE, EXCEPTION_MESSAGE } from 'App/Constants/String'
import { HTTP_CODE } from 'App/Constants/Number'

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor () {
    super(Logger)
  }

  public async handle(error, ctx: HttpContextContract) {
    const { response } = ctx

    if (error.code === EXCEPTION_CODE.E_VALIDATION_FAILURE) {
      return response.sendError(error.messages.errors, EXCEPTION_MESSAGE.E_VALIDATION_FAILURE, HTTP_CODE.VALIDATION_FAILURE)
    }
    else if (error.code === EXCEPTION_CODE.E_ROUTE_NOT_FOUND) {
      return response.sendError([], EXCEPTION_MESSAGE.E_ROUTE_NOT_FOUND, HTTP_CODE.NOT_FOUND)
    }
    else if (error.code === EXCEPTION_CODE.E_ROW_NOT_FOUND) {
      return response.sendError([], EXCEPTION_MESSAGE.E_ROW_NOT_FOUND, HTTP_CODE.NOT_FOUND)
    }
    else if (error.code === EXCEPTION_CODE.E_UNAUTHORIZED_ACCESS) {
      return response.sendError([], EXCEPTION_MESSAGE.E_UNAUTHORIZED_ACCESS, HTTP_CODE.UNAUTHORIZED)
    }
    else if (error.code === EXCEPTION_CODE.E_FORBIDDEN_ACCESS) {
      return response.sendError([], EXCEPTION_MESSAGE.E_FORBIDDEN_ACCESS, HTTP_CODE.FORBIDDEN)
    }
    else if (error.code === EXCEPTION_CODE.E_NOTACCAPTABLE_ACCESS) {
      return response.sendError([], EXCEPTION_MESSAGE.E_NOTACCAPTABLE_ACCESS, HTTP_CODE.FORBIDDEN)
    }
    else if (error.code === EXCEPTION_CODE.E_INVALID_MODIFY_ROLE) {
      return response.sendError([], EXCEPTION_MESSAGE.E_INVALID_MODIFY_ROLE, HTTP_CODE.NOT_ACCEPTABLE)
    }
    else if (error.code === EXCEPTION_CODE.E_INVALID_AUTH_UID || error.code === EXCEPTION_CODE.E_INVALID_AUTH_PASSWORD) {
      return response.sendError([], EXCEPTION_MESSAGE.E_INVALID_AUTH_PASSWORD, HTTP_CODE.BAD_REQUEST)
    }

    return super.handle(error, ctx)
  }
}
