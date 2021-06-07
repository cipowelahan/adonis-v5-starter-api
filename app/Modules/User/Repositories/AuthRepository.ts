import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {
  RegisterUserValidationDto,
  LoginUserValidationDto,
  PasswordChangeDto,
  EmailChangeDto,
  ProfileChangeDto
} from '../Validations/AuthValidation'
import { AuthenticationException } from '@adonisjs/auth/build/standalone'
import { EXCEPTION_CODE, EXCEPTION_MESSAGE } from 'App/Constants/String'
import Database from '@ioc:Adonis/Lucid/Database'
import Hash from '@ioc:Adonis/Core/Hash'
import User from './Entities/User'

export default class AuthRepository {
  public async register(data: RegisterUserValidationDto) {
    const user = new User()
    user.fill(data)
    await user.save()
    return await User.find(user.id)
  }

  public async login({ auth }: HttpContextContract, data: LoginUserValidationDto) {
    const checkUser = await User.query().whereNull('deleted_at').where('email', data.email).first()
    if (!checkUser) {
      throw new AuthenticationException(EXCEPTION_MESSAGE.E_INVALID_AUTH_UID, EXCEPTION_CODE.E_INVALID_AUTH_UID)
    }
    const token = await auth.attempt(data.email, data.password)
    return token.toJSON()
  }

  public async find({ auth }:HttpContextContract) {
    return await User.findOrFail(auth.user!.id)
  }

  public async logout({ auth }: HttpContextContract) {
    await auth.logout()
  }

  public async logoutAll({ auth }: HttpContextContract) {
    await Database.from('user_tokens').where('user_id', auth.user!.id).delete()
  }

  public async getProfile({ auth, request }: HttpContextContract) {
    const UserRepository = (await import('./UserRepository')).default
    const repo = new UserRepository()
    return await repo.find(auth.user?.id, request.qs())
  }

  public async updateProfile(ctx: HttpContextContract, data: ProfileChangeDto) {
    const user = await this.find(ctx)
    user.merge(data)
    await user.save()
  }

  public async changePassword(ctx: HttpContextContract, data: PasswordChangeDto) {
    const user = await this.find(ctx)
    const checkOldPassword = await Hash.verify(user.password, data.old_password)
    
    if (!checkOldPassword) {
      throw new AuthenticationException(EXCEPTION_MESSAGE.E_INVALID_AUTH_PASSWORD, EXCEPTION_CODE.E_INVALID_AUTH_PASSWORD)
    }

    user.password = await Hash.make(data.password)
    user.updated_by = user.id
    await user.save()
  }

  public async changeEmail(ctx: HttpContextContract, data: EmailChangeDto) {
    const user = await this.find(ctx)
    const chackPassword = await Hash.verify(user.password, data.password)

    if (!chackPassword) {
      throw new AuthenticationException(EXCEPTION_MESSAGE.E_INVALID_AUTH_UID, EXCEPTION_CODE.E_INVALID_AUTH_UID)
    }

    user.email = data.email
    user.updated_by = user.id
    await user.save()
  }

}