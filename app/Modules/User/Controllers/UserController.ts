import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { UserStoreValidation, UserUpdateValidation } from '../Validations/UserValidation'
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

  public async find(ctx: HttpContextContract) {
    const user = await this.repo.find(Number(ctx.params.id))
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
  public async destory(ctx: HttpContextContract) {
    await this.repo.destroy(ctx)
    return ctx.response.sendData(null, "Deleted Successfully")
  }
}