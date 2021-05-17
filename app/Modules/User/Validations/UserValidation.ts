import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Role from '../Constant/Role'

export class UserStoreValidationDto {
  public name: string
  public email: string
  public role: number
  public password: string
}

export class UserStoreValidation {
  constructor(private ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({escape: true, trim: true }),
    email: schema.string({ escape: true, trim: true }, [ rules.email(), rules.unique({ table: 'users', column: 'email', where: { deleted_at: null }}) ]),
    role: schema.enum([Role.ADMIN, Role.STAFF] as const),
    password: schema.string({}, [ rules.minLength(6), rules.maxLength(18) ])
  })

  public cacheKey = this.ctx.routeKey

  public messages = {
    required: '{{ field }} is required',
    email: 'invalid format email on {{ field }}',
    'password.minLength': 'password min 6 character',
    'password.maxLength': 'password max 6 character',
    'password.string': 'password must contain character'
  }

}

export class UserUpdateValidationDto {
  public name: string
  public role: number
}

export class UserUpdateValidation {
  constructor(private ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({escape: true, trim: true }),
    role: schema.enum([Role.ADMIN, Role.STAFF] as const)
  })

  public cacheKey = this.ctx.routeKey

  public messages = {
    required: '{{ field }} is required'
  }

}
