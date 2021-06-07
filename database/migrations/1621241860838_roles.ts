import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Roles extends BaseSchema {
  protected tableNameRole = 'roles'
  protected tableNamePermission = 'permissions'

  protected tableNameRoleUser = 'role_users'
  protected tableNameRolePermission = 'role_permissions'

  public async up () {
    this.schema.createTable(this.tableNameRole, (table) => {
      table.increments('id')
      table.string('name').notNullable().unique()
    })

    this.schema.createTable(this.tableNamePermission, (table) => {
      table.increments('id')
      table.string('name').notNullable().unique()
    })

    this.schema.createTable(this.tableNameRoleUser, (table) => {
      table.bigInteger('user_id').notNullable().unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('role_id').notNullable().unsigned().references('id').inTable(this.tableNameRole).onDelete('CASCADE')
    })

    this.schema.createTable(this.tableNameRolePermission, (table) => {
      table.integer('role_id').notNullable().unsigned().references('id').inTable(this.tableNameRole).onDelete('CASCADE')
      table.integer('permission_id').notNullable().unsigned().references('id').inTable(this.tableNamePermission).onDelete('CASCADE')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableNameRoleUser)
    this.schema.dropTable(this.tableNameRolePermission)
    this.schema.dropTable(this.tableNamePermission)
    this.schema.dropTable(this.tableNameRole)
  }
}
