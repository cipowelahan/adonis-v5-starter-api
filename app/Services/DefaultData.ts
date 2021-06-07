import * as RolePermission from 'App/Constants/RolePermission'
import Permission from 'App/Modules/Role/Repositories/Entities/Permission'
import Role from 'App/Modules/Role/Repositories/Entities/Role'
import User from 'App/Modules/User/Repositories/Entities/User'

class DefaultData {
  private superAdminPermission = [
    RolePermission.ROLE_PERMISSION,
    RolePermission.PERMISSION_PERMISSION
  ]

  private adminPermission = [
    RolePermission.USER_PERMISSION
  ]

  private defaultPermission = [
    RolePermission.ROLE_PERMISSION.LIST,
    RolePermission.ROLE_PERMISSION.SHOW,
    RolePermission.PERMISSION_PERMISSION.LIST,
    RolePermission.PERMISSION_PERMISSION.SHOW
  ]

  public async run(): Promise<string> {
    const permissions = await this.handlePermission()
    for (const roleDefault of Object.values(RolePermission.ROLE_DEFAULT)) {
      await Role.firstOrCreate({ name: roleDefault })
    }

    const permissionsSync = permissions.map((permission) => permission.id)
    const superAdmin = await Role.findByOrFail('name', RolePermission.ROLE_DEFAULT.SUPERADMIN)
    await superAdmin.related('permissions').sync(permissionsSync)

    // HANDLE OTHER ROLE
    await this.handleRoleAdmin(permissions)
    await this.handleRoleStaff(permissions)

    // DEFAULT USER
    const users = await User.first()
    if (users) {
      return "update permissions and sync to superadmin"
    }
    else {
      const { defaultSuperAdmin } = await import('Config/values')
      const user = new User()
      user.fill({
        ...defaultSuperAdmin
      })
      await user.save()
      await user.related('roles').sync([superAdmin.id])
      return "update permissions and new superadmin"
    }
  }

  private async handlePermission(): Promise<Permission[]> {
    const syncId: Permission[] = []

    for (const enumPermission of [...this.superAdminPermission, ...this.adminPermission]) {
      for (const permission of Object.values(enumPermission)) {
        const entityPermission = await Permission.firstOrCreate({ name: permission })
        syncId.push(entityPermission)
      }
    }

    return syncId
  }

  private async handleRoleAdmin(permissions: Permission[]) {
    const permissionsSync: Array<number> = []

    for (const enumPermission of [...this.adminPermission, this.defaultPermission]) {
      const arrPermission: Array<string> = []
      for (const p of Object.values(enumPermission)) {
        arrPermission.push(p)
      }
      const filterArr = permissions.filter((permission) => arrPermission.includes(permission.name))
      const arrSync = filterArr.map((as) => as.id)
      permissionsSync.push(...arrSync)
    }

    const admin = await Role.findByOrFail('name', RolePermission.ROLE_DEFAULT.ADMIN)
    await admin.related('permissions').sync(permissionsSync)
  }

  private async handleRoleStaff(permissions: Permission[]) {
    const permissionsSync: Array<number> = []

    for (const enumPermission of [this.defaultPermission]) {
      const arrPermission: Array<string> = []
      for (const p of Object.values(enumPermission)) {
        arrPermission.push(p)
      }
      const filterArr = permissions.filter((permission) => arrPermission.includes(permission.name))
      const arrSync = filterArr.map((as) => as.id)
      permissionsSync.push(...arrSync)
    }

    const staff = await Role.findByOrFail('name', RolePermission.ROLE_DEFAULT.STAFF)
    await staff.related('permissions').sync(permissionsSync)
  }
}

export default new DefaultData()