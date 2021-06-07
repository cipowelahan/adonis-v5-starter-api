import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {
  RegisterUserValidation,
  LoginUserValidation,
  PasswordChangeValidation,
  EmailChangeValidation,
  ProfileChangeValidation
} from '../Validations/AuthValidation'
import { RESPONSE_MESSAGE } from 'App/Constants/String'
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
    return ctx.response.sendData(null, RESPONSE_MESSAGE.LOGOUT)
  }

  public async logoutAll(ctx: HttpContextContract) {
    await this.repo.logoutAll(ctx)
    return ctx.response.sendData(null, RESPONSE_MESSAGE.LOGOUT_ALL)
  }

  public async getProfile(ctx: HttpContextContract) {
    const user = await this.repo.getProfile(ctx)
    return ctx.response.sendData(user)
  }

  public async updateProfile(ctx: HttpContextContract) {
    const data = await ctx.request.validate(ProfileChangeValidation)
    await this.repo.updateProfile(ctx, data)
    return ctx.response.sendData(null, RESPONSE_MESSAGE.UPDATED)
  }

  public async changePassword(ctx: HttpContextContract) {
    const data = await ctx.request.validate(PasswordChangeValidation)
    await this.repo.changePassword(ctx, data)
    return ctx.response.sendData(null, RESPONSE_MESSAGE.PASSWORD_CHANGED)
  }

  public async changeEmail(ctx: HttpContextContract) {
    const data = await ctx.request.validate(EmailChangeValidation)
    await this.repo.changeEmail(ctx, data)
    return ctx.response.sendData(null, RESPONSE_MESSAGE.EMAIL_CHANGED)
  }
}
