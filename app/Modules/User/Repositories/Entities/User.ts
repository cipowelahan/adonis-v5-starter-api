import {
  column,
  beforeSave,
  manyToMany,
  ManyToMany,
  scope,
  ModelQueryBuilderContract
} from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import Role from 'App/Modules/Role/Repositories/Entities/Role'
import BaseModify from './BaseModify'

type Builder = ModelQueryBuilderContract<typeof User>

export default class User extends BaseModify {
  public static table = 'users'

  @column({
    isPrimary: true,
    serialize: ((value) => Number(value))
  })
  public id: number

  @column()
  public name: string

  @column()
  public email: string

  @column({
    serializeAs: null
  })
  public password: string

  @manyToMany(() => Role, {
    pivotTable: 'role_users',
    localKey: 'id',
    pivotForeignKey: 'user_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'role_id'
  })
  public roles: ManyToMany<typeof Role>

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  public static withRelation = scope((query: Builder, relations: string[]) => {
    if (relations.includes('roles')) {
      query.preload('roles')
    }
  })
    
}