import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export class PermissionValidationDto {
  public name: string
}

export class PermissionValidation {
  constructor(private ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({
      escape: true,
      trim: true
    }, [
      rules.unique({
        table: 'permissions',
        column: 'name',
        whereNot: {
          id: this.ctx.params?.id || 0 
        }
      })
    ])
  })

  public cacheKey = this.ctx.routeKey

  public messages = {
    required: '{{ field }} is required'
  }
}