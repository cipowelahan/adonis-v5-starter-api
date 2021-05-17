import { BaseModel, beforeSave, belongsTo, column, BelongsTo } from '@ioc:Adonis/Lucid/Orm';
import { DateTime } from "luxon";
import Hash from '@ioc:Adonis/Core/Hash';

export default class User extends BaseModel {
  public static table = 'users'

  @column({ isPrimary: true, serialize: ((value) => Number(value)) })
  public id: number

  @column()
  public name: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column({ serializeAs: null })
  public createdBy: number

  @column({ serializeAs: null })
  public updatedBy: number

  @column({ serializeAs: null })
  public DeletedBy: number

  @belongsTo(() => User, { foreignKey: 'created_by' })
  public creator: BelongsTo<typeof User>

  @belongsTo(() => User, { foreignKey: 'updated_by' })
  public editor: BelongsTo<typeof User>

  @belongsTo(() => User, { foreignKey: 'deleted_by' })
  public destroyer: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true , serialize: (value) => { return value ? DateTime.fromISO(value).toFormat('yyyy-LL-dd HH:mm:ss') : value } })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serialize: (value) => { return value ? DateTime.fromISO(value).toFormat('yyyy-LL-dd HH:mm:ss') : value } })
  public updatedAt: DateTime

  @column.dateTime({ serialize: (value) => { return value ? DateTime.fromISO(value).toFormat('yyyy-LL-dd HH:mm:ss') : value } })
  public deletedAt: DateTime

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
    
}