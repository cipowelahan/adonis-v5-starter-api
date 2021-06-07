import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export class RegisterUserValidationDto {
  public name: string
  public email: string
  public password: string
}

export class RegisterUserValidation {
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
      rules.maxLength(18),
      rules.confirmed()
    ])
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

export class LoginUserValidationDto {
  public email: string
  public password: string
}

export class LoginUserValidation {
  constructor(private ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string({
      escape: true,
      trim: true
    }, [
      rules.email()
    ]),
    password: schema.string({}, [
      rules.minLength(6),
      rules.maxLength(18)
    ])
  })

  public cacheKey = this.ctx.routeKey

  public messages = {
    required: '{{ field }} is required',
    email: 'invalid format email on {{ field }}'
  }

}

export class ProfileChangeDto {
  public name: string
}

export class ProfileChangeValidation {
  constructor(private ctx: HttpContextContract) { }

  public schema = schema.create({
    name: schema.string({
      escape: true,
      trim: true
    })
  })

  public cacheKey = this.ctx.routeKey
}

export class PasswordChangeDto {
  public old_password: string
  public password: string
}

export class PasswordChangeValidation {
  constructor(private ctx: HttpContextContract) {}

  public schema = schema.create({
    old_password: schema.string({}, [
      rules.minLength(6),
      rules.maxLength(18)
    ]),
    password: schema.string({}, [
      rules.minLength(6),
      rules.maxLength(18),
      rules.confirmed()
    ])
  })

  public cacheKey = this.ctx.routeKey

  public messages = {
    required: '{{ field }} is required',
  }
}

export class EmailChangeDto {
  public email: string
  public password: string
}

export class EmailChangeValidation {
  constructor(private ctx: HttpContextContract) {}

  public schema = schema.create({
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
        },
        whereNot: {
          id: this.ctx.auth.user.id
        }
      })
    ]),
    password: schema.string({}, [
      rules.minLength(6),
      rules.maxLength(18)
    ])
  })

  public cacheKey = this.ctx.routeKey

  public messages = {
    required: '{{ field }} is required',
  }
}