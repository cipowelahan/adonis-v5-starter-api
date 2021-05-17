import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { RegisterUserValidation, LoginUserValidation, PasswordChangeValidation, EmailChangeValidation } from '../Validations/AuthValidation'
import AuthRepository from '../Repositories/AuthRepository'

export default class AuthController {
  protected repo: AuthRepository

  constructor() {
    this.repo = new AuthRepository()
  }

  public async register(ctx: HttpContextContract) {
    const data = await ctx.request.validate(RegisterUserValidation)
    const user = await this.repo.register(data)
    return ctx.response.sendData(user)
  }

  public async login(ctx: HttpContextContract) {
    const data = await ctx.request.validate(LoginUserValidation)
    const token = await this.repo.login(ctx, data)
    return ctx.response.sendData(token)
  }

  public async logout(ctx: HttpContextContract) {
    await this.repo.logout(ctx)
    return ctx.response.sendData(null, "Logout Successfully")
  }

  public async logoutAll(ctx: HttpContextContract) {
    await this.repo.logoutAll(ctx)
    return ctx.response.sendData(null, "Logout All Successfully")
  }

  public async getProfile(ctx: HttpContextContract) {
    return ctx.response.sendData(ctx.auth.user)
  }

  public async changePassword(ctx: HttpContextContract) {
    const data = await ctx.request.validate(PasswordChangeValidation)
    await this.repo.changePassword(ctx, data)
    return ctx.response.sendData(null, "Password Changed Successfully")
  }

  public async changeEmail(ctx: HttpContextContract) {
    const data = await ctx.request.validate(EmailChangeValidation)
    await this.repo.changeEmail(ctx, data)
    return ctx.response.sendData(null, "Email Changed Successfully")
  }
}
