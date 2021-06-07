import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { RoleValidationDto } from '../Validations/RoleValidation'
import { AuthenticationException } from '@adonisjs/auth/build/standalone'
import { EXCEPTION_CODE, EXCEPTION_MESSAGE } from 'App/Constants/String'
import { ROLE_DEFAULT } from 'App/Constants/RolePermission'
import Role from './Entities/Role'

export default class RoleRepository {
  public async index({ request }: HttpContextContract) {
    const urlQuery = request.qs()
    const page = urlQuery.page || 1
    const limit = urlQuery.limit || 10
    const roles = Role
      .query()
      .if(urlQuery.search, (query) => {
        query.where('name', 'ilike', `%${urlQuery.search}%`)
      })
      .if(urlQuery.with, (query) => {
        const listWith = String(urlQuery.with).split(',')

        if (listWith.includes('permissions')) {
          query.preload('permissions')
        }
      })
      .orderBy('name', 'asc')

    if (urlQuery.paginate == "false") {
      return await roles
    }

    const paginate = await roles.paginate(page, limit)
    paginate.baseUrl(request.url())
    paginate.queryString(urlQuery)
    return paginate
  }

  public async find(id: number, urlQuery?: Record<string, any>): Promise<Role>{
    const role = await Role
      .query()
      .where('id', id)
      .if(urlQuery, (query) => {
        const listWith = String(urlQuery?.with).split(',')

        if (listWith.includes('permissions')) {
          query.preload('permissions')
        }
      })
      .first()

    if (!role) {
      throw new AuthenticationException(EXCEPTION_MESSAGE.E_ROW_NOT_FOUND, EXCEPTION_CODE.E_ROW_NOT_FOUND)
    }

    return role
  }

  public async store(data: RoleValidationDto) {
    const role = new Role()
    role.name = data.name
    await role.save()
    await role.related('permissions').sync(data.permissions)
    return await this.find(role.id)
  }

  private isInvalidRoleToModify(nameCheck: string): boolean {
    const defaultRole: Array<string> = [];
    for (const roleDefault of Object.values(ROLE_DEFAULT)) {
      defaultRole.push(roleDefault)
    }
    return defaultRole.includes(nameCheck)
  }

  public async update(id: number, data: RoleValidationDto) {
    const role = await this.find(id)
    if (this.isInvalidRoleToModify(role.name)) {
      throw new AuthenticationException(EXCEPTION_MESSAGE.E_INVALID_MODIFY_ROLE, EXCEPTION_CODE.E_INVALID_MODIFY_ROLE)
    }
    role.name = data.name
    await role.save()
    await role.related('permissions').sync(data.permissions)
    return this.find(role.id)
  }

  public async destroy(id: number) {
    const role = await this.find(id)
    if (this.isInvalidRoleToModify(role.name)) {
      throw new AuthenticationException(EXCEPTION_MESSAGE.E_INVALID_MODIFY_ROLE, EXCEPTION_CODE.E_INVALID_MODIFY_ROLE)
    }
    await role.delete()
  }
}