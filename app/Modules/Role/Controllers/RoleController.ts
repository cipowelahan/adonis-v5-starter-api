import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { RoleValidation } from '../Validations/RoleValidation'
import { RESPONSE_MESSAGE } from 'App/Constants/String'
import RoleRepository from '../Repositories/RoleRepository'

export default class RoleController {
  protected repo: RoleRepository

  constructor() {
    this.repo = new RoleRepository()
  }

  public async index(ctx: HttpContextContract) {
    const data = await this.repo.index(ctx)
    return ctx.response.sendData(data)
  }

  public async store(ctx: HttpContextContract) {
    const data = await ctx.request.validate(RoleValidation)
    const role = await this.repo.store(data)
    return ctx.response.sendData(role) 
  }

  public async show(ctx: HttpContextContract) {
    const role = await this.repo.find(Number(ctx.params.id), ctx.request.qs())
    return ctx.response.sendData(role)
  }

  public async update(ctx: HttpContextContract) {
    const data = await ctx.request.validate(RoleValidation)
    const role = await this.repo.update(Number(ctx.params.id), data)
    return ctx.response.sendData(role)
  }

  public async destroy(ctx: HttpContextContract) {
    await this.repo.destroy(Number(ctx.params.id))
    return ctx.response.sendData(null, RESPONSE_MESSAGE.DELETED)
  }
}