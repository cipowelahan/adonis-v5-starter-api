import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export class UserStoreValidationDto {
  public name: string
  public email: string
  public password: string
  public roles: Array<number>
}

export class UserStoreValidation {
  constructor(private ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({
      escape: true,
      trim: true
    }),
    email: schema.string({
      escape: true,
      trim: true
    }, [
      rules.email(),
      rules.unique({
        table: 'users',
        column: 'email',
        where: {
          deleted_at: null
        }
      })
    ]),
    password: schema.string({}, [
      rules.minLength(6),
      rules.maxLength(18)
    ]),
    roles: schema.array().members(schema.number([
      rules.exists({
        table: 'roles',
        column: 'id'
      })
    ]))
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
  public roles?: Array<number>
}

export class UserUpdateValidation {
  constructor(private ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({escape: true, trim: true }),
    roles: schema.array.optional().members(schema.number([
      rules.exists({
        table: 'roles',
        column: 'id'
      })
    ]))
  })

  public cacheKey = this.ctx.routeKey

  public messages = {
    required: '{{ field }} is required'
  }

}
