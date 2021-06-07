import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { UserStoreValidation, UserUpdateValidation } from '../Validations/UserValidation'
import { RESPONSE_MESSAGE } from 'App/Constants/String'
import UserRepository from '../Repositories/UserRepository'

export default class UserController {
  protected repo: UserRepository

  constructor() {
    this.repo = new UserRepository()
  }

  public async index(ctx: HttpContextContract) {
    const users = await this.repo.index(ctx)
    return ctx.response.sendData(users)
  }

  public async show(ctx: HttpContextContract) {
    const user = await this.repo.find(Number(ctx.params.id), ctx.request.qs())
    return ctx.response.sendData(user)
  }

  public async store(ctx: HttpContextContract) {
    const data = await ctx.request.validate(UserStoreValidation)
    const user = await this.repo.store(ctx, data)
    return ctx.response.sendData(user)
  }

  public async update(ctx: HttpContextContract) {
    const data = await ctx.request.validate(UserUpdateValidation)
    const user = await this.repo.update(ctx, data)
    return ctx.response.sendData(user)
  }
  public async destroy(ctx: HttpContextContract) {
    await this.repo.destroy(ctx)
    return ctx.response.sendData(null, RESPONSE_MESSAGE.DELETED)
  }
}