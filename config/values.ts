import Env from '@ioc:Adonis/Core/Env'

export const defaultSuperAdmin = {
  name: Env.get('SUPERADMIN_NAME', 'superadmin'),
  email: Env.get('SUPERADMIN_EMAIL', 'superadmin@superadmin.com'),
  password: Env.get('SUPERADMIN_PASSWORD', 'superadmin1234')
}

export const defaultData = {
  password: Env.get('DEFAULT_DATA', 'defaultdata1234')
}