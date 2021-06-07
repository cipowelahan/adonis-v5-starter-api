import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { UserStoreValidationDto, UserUpdateValidationDto } from '../Validations/UserValidation'
import { AuthenticationException } from '@adonisjs/auth/build/standalone'
import { DateTime } from 'luxon';
import { EXCEPTION_CODE, EXCEPTION_MESSAGE } from 'App/Constants/String'
import User from './Entities/User'

export default class UserRepository {
  public async index({ request }: HttpContextContract) {
    const urlQuery = request.qs()
    const page = urlQuery.page || 1
    const limit = urlQuery.limit || 10
    const users = User
      .query()
      .if(urlQuery.search, (query) => {
        query.apply((scope) => scope.withSearch(['name', 'email'], urlQuery.search))
      })
      .if(urlQuery.with, (query) => {
        const listWith = String(urlQuery.with).split(',')
        query.apply((scope) => scope.withRelation(listWith))
        query.apply((scope) => scope.withRelationModify(listWith))
      })
      .orderBy('created_at', 'desc')

    if (urlQuery.paginate == "false") {
      return await users
    }
    
    const paginate = await users.paginate(page, limit)
    paginate.baseUrl(request.url())
    paginate.queryString(urlQuery)
    return paginate
  }

  public async find(id: number, urlQuery?: Record<string, any>): Promise<User> {
    const user = await User
      .query()
      .where('id', id)
      .if(urlQuery, (query) => {
        const listWith = String(urlQuery?.with).split(',')
        query.apply((scope) => scope.withRelation(listWith))
        query.apply((scope) => scope.withRelationModify(listWith))
      })
      .first()

    if (!user) {
      throw new AuthenticationException(EXCEPTION_MESSAGE.E_ROW_NOT_FOUND, EXCEPTION_CODE.E_ROW_NOT_FOUND)
    }

    return user
  }

  public async store({ auth }: HttpContextContract, data: UserStoreValidationDto) {
    const authUser = auth.user!
    const { roles, ...otherData } = data
    const user = new User()
    user.fill({
      ...otherData,
      created_by: authUser.id
    })
    await user.save()
    await user.related('roles').sync(roles)
    return await this.find(user.id)
  }

  public async update({ auth, params }: HttpContextContract, data: UserUpdateValidationDto) {
    const authUser = auth.user!
    const user = await this.find(params.id)
    const { roles, ...otherData } = data
    user.merge({
      ...otherData,
      updated_by: authUser.id
    })
    await user.save()
    if (roles) {
      await user.related('roles').sync(roles)
    }
    return await this.find(user.id)
  }

  public async destroy({ auth, params }: HttpContextContract) {
    const authUser = auth.user!
    const user = await this.find(params.id)
    await User.query().where('id', user.id).update({
      deleted_by: authUser.id,
      deleted_at: DateTime.now()
    })
  }
}