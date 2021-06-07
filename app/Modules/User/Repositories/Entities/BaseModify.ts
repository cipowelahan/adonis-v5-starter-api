import { BaseModel, column, belongsTo, BelongsTo, scope, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from "luxon"

type Builder = ModelQueryBuilderContract<typeof BaseModify>

class Modify extends BaseModel {
  public static table = 'users'

  @column({
    isPrimary: true,
    serialize: ((value) => Number(value))
  })
  public id: number

  @column()
  public name: string
}

export default class BaseModify extends BaseModel {
  @column({
    serializeAs: null
  })
  public created_by: number

  @column({
    serializeAs: null
  })
  public updated_by: number

  @column({
    serializeAs: null
  })
  public deleted_by: number

  @belongsTo(() => Modify, {
    foreignKey: 'created_by'
  })
  public creator: BelongsTo<typeof Modify>

  @belongsTo(() => Modify, {
    foreignKey: 'updated_by'
  })
  public editor: BelongsTo<typeof Modify>

  @belongsTo(() => Modify, {
    foreignKey: 'deleted_by'
  })
  public destroyer: BelongsTo<typeof Modify>

  @column.dateTime({
    autoCreate: true, 
    serialize: (value) => { return value ? DateTime.fromISO(value).toFormat('yyyy-LL-dd HH:mm:ss') : value }
  })
  public created_at: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serialize: (value) => { return value ? DateTime.fromISO(value).toFormat('yyyy-LL-dd HH:mm:ss') : value }
  })
  public updated_at: DateTime

  @column.dateTime({
    serialize: (value) => { return value ? DateTime.fromISO(value).toFormat('yyyy-LL-dd HH:mm:ss') : value }
  })
  public deleted_at: DateTime

  public static withModify = scope((query: Builder) => {
    query
      .preload('creator')
      .preload('editor')
      .preload('destroyer')
  })

  public static withTrashed = scope((query: Builder, useTrashed: boolean) => {
    if (useTrashed) {
      return
    }

    query.whereNull('deleted_at')
  })

  public static withRelationModify = scope((query: Builder, relations: string[]) => {
    if (relations.includes('modify')) {
      query.apply((scope) => {
        scope.withModify()
      })
    }
    query.apply((scope) => {
      scope.withTrashed(relations.includes('trashed'))
    })
  })

  public static withSearch = scope((query: Builder, colomns: string[], search: string, conditions: string = 'ilike') => {
    if (colomns.length == 1) {
      query.where(colomns[0], conditions, `%${search}%`)
    }
    else {
      query.where((subQuery) => {
        subQuery
          .where(colomns[0], conditions, `%${search}%`)

        for (let i = 1; i < colomns.length; i++) {
          subQuery.orWhere(colomns[i], conditions, `%${search}%`)
        }
      })
    }
  })

}

