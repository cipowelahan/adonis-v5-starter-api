import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ApiTokens extends BaseSchema {
  protected tableName = 'user_tokens'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')
      table.bigInteger('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.string('name').notNullable()
      table.string('type').notNullable()
      table.string('token').notNullable().unique()
      table.timestamp('expires_at', { useTz: false }).nullable()
      table.timestamp('created_at', { useTz: false }).notNullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
