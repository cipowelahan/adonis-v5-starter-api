import Route from '@ioc:Adonis/Core/Route'
import { USER_PERMISSION } from 'App/Constants/RolePermission'

Route
  .group(() => {

    Route
      .group(() => {
        Route.post('/register', 'AuthController.register')
        Route.post('/login', 'AuthController.login')
    
        Route
          .group(() => {
            Route.post('/logout', 'AuthController.logout')
            Route.post('/logout-all', 'AuthController.logoutAll')
            Route.get('/user', 'AuthController.getProfile')
            Route.put('/user', 'AuthController.updateProfile')
            Route.put('/password', 'AuthController.changePassword')
            Route.put('/email', 'AuthController.changeEmail')
          })
          .middleware('auth')
    
      })
      .prefix('/auth')

      Route
        .resource('users', 'UserController')
        .apiOnly()
        .middleware({
          'index': ['auth', `permissions:${USER_PERMISSION.LIST}`],
          'store': ['auth', `permissions:${USER_PERMISSION.CREATE}`],
          'show': ['auth', `permissions:${USER_PERMISSION.SHOW}`],
          'update': ['auth', `permissions:${USER_PERMISSION.UPDATE}`],
          'destroy': ['auth', `permissions:${USER_PERMISSION.DELETE}`],
        })

  })
  .namespace('App/Modules/User/Controllers')