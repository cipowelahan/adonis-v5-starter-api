import Route from '@ioc:Adonis/Core/Route'
import AuthController from './Controllers/AuthController'
import UserController from './Controllers/UserController'

Route
  .group(() => {
    Route.post('/register', (ctx) => new AuthController().register(ctx))
    Route.post('/login', (ctx) => new AuthController().login(ctx))

    Route
      .group(() => {
        Route.post('/logout', (ctx) => new AuthController().logout(ctx))
        Route.post('/logoutAll', (ctx) => new AuthController().logoutAll(ctx))
        Route.get('/user', (ctx) => new AuthController().getProfile(ctx))
        Route.put('/password', (ctx) => new AuthController().changePassword(ctx))
        Route.put('/email', (ctx) => new AuthController().changeEmail(ctx))
      })
      .middleware('auth')

  })
  .prefix('/auth')

Route
  .group(() => {
    Route
      .get('/', (ctx) => new UserController().index(ctx))

    Route
      .post('/', (ctx) => new UserController().store(ctx))

    Route
      .get('/:id', (ctx) => new UserController().find(ctx))
      .where('id', /^[0-9]+$/)

    Route
      .put('/:id', (ctx) => new UserController().update(ctx))
      .where('id', /^[0-9]+$/)

    Route
      .delete('/:id', (ctx) => new UserController().destory(ctx))
      .where('id', /^[0-9]+$/)

  })
  .prefix('/users')
  .middleware(['auth'])