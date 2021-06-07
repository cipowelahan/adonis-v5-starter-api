import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { PermissionValidation } from '../Validations/PermissionValidation'
import { RESPONSE_MESSAGE } from 'App/Constants/String'
import PermissionRepository from '../Repositories/PermissionRepository'

export default class PermissionController {
  protected repo: PermissionRepository

  constructor() {
    this.repo = new PermissionRepository()
  }

  public async index(ctx: HttpContextContract) {
    const data = await this.repo.index(ctx)
    return ctx.response.sendData(data)
  }

  public async store(ctx: HttpContextContract) {
    const data = await ctx.request.validate(PermissionValidation)
    const permission = await this.repo.store(data)
    return ctx.response.sendData(permission) 
  }

  public async show(ctx: HttpContextContract) {
    const permission = await this.repo.find(Number(ctx.params.id))
    return ctx.response.sendData(permission)
  }

  public async update(ctx: HttpContextContract) {
    const data = await ctx.request.validate(PermissionValidation)
    const permission = await this.repo.update(Number(ctx.params.id), data)
    return ctx.response.sendData(permission)
  }

  public async destroy(ctx: HttpContextContract) {
    await this.repo.destroy(Number(ctx.params.id))
    return ctx.response.sendData(null, RESPONSE_MESSAGE.DELETED)
  }
}