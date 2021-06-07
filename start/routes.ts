import Route from '@ioc:Adonis/Core/Route'
import HealthCheck from '@ioc:Adonis/Core/HealthCheck'

Route.where('id', /^[0-9]+$/)

import "App/Modules/User/routes"
import "App/Modules/Role/routes"

Route.get('/', async () => {
  const healthCheck = await HealthCheck.getReport()
  return {
    appName: 'panorama',
    healthCheck
  }
})

Route.post('/generate-default-data', async ({ request }) => {
  let message: string
  const password = request.input('password', '---++++---')
  const { defaultData } = await import('Config/values')

  if (password == defaultData.password) {
    const DefaultData = (await import('App/Services/DefaultData')).default
    message = await DefaultData.run()
  }
  else {
    message = "try again"
  }

  return {
    message
  }
})