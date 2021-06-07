import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { AuthenticationException } from '@adonisjs/auth/build/standalone'
import { EXCEPTION_CODE, EXCEPTION_MESSAGE } from 'App/Constants/String'
import Authorization from 'App/Services/Authorization'

export default class PermissionsMiddleware {
  public async handle({ auth }: HttpContextContract, next: () => Promise<void>, permissions: string[]) {
    const userId = auth.user.id || 0
    const validAccess = await Authorization.can(userId, permissions)
    if (!validAccess) {
      throw new AuthenticationException(EXCEPTION_MESSAGE.E_FORBIDDEN_ACCESS, EXCEPTION_CODE.E_FORBIDDEN_ACCESS)
    }
    await next()
  }
}
