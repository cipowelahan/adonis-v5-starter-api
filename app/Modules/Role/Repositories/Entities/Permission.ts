import {
  BaseModel,
  column,
  manyToMany,
  ManyToMany
} from '@ioc:Adonis/Lucid/Orm'
import Role from './Role'

export default class Permission extends BaseModel {
  public static table = 'permissions'

  @column({
    isPrimary: true,
    serialize: ((value) => Number(value))
  })
  public id: number

  @column()
  public name: string

  @manyToMany(() => Role, {
    pivotTable: 'role_permissions',
    localKey: 'id',
    pivotForeignKey: 'permission_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'role_id'
  })
  public roles: ManyToMany<typeof Role>
}