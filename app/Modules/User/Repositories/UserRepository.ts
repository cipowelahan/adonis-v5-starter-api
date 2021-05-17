import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { UserStoreValidationDto, UserUpdateValidationDto } from '../Validations/UserValidation'
import { AuthenticationException } from '@adonisjs/auth/build/standalone'
import { DateTime } from 'luxon';
import User from './Entities/User'

export default class UserRepository {
  public async index({ request }: HttpContextContract) {
    const urlQuery = request.get()
    const page = urlQuery.page || 1
    const users = await User
      .query()
      .whereNull('deleted_at')
      .if(urlQuery.search, (query) => {
        query.where((subQuery) => {
            subQuery
              .where('name', 'ilike', `%${urlQuery.search}%`)
              .orWhere('email', 'ilike', `%${urlQuery.search}%`)
        })
      })
      .orderBy('created_at', 'desc')
      .paginate(page, 10)
    
    users.baseUrl(request.url())
    users.queryString(urlQuery)
    return users
  }

  public async find(id: number) {
    const user = await User.query().where('id', id).whereNull('deleted_at').first()
    if (!user) {
      throw new AuthenticationException("Row Not Found", "E_ROW_NOT_FOUND")
    }
    return await User.findOrFail(id)
  }

  public async store({ auth }: HttpContextContract, data: UserStoreValidationDto) {
    const authUser = auth.user!
    const user = new User()
    user.fill(data)
    user.createdBy = authUser.id
    await user.save()
    return await this.find(user.id)
  }

  public async update({ auth, params }: HttpContextContract, data: UserUpdateValidationDto) {
    const authUser = auth.user!
    const user = await this.find(params.id)
    user.name = data.name
    user.role = data.role
    user.updatedBy = authUser.id
    await user.save()
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