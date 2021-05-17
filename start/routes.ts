import Route from '@ioc:Adonis/Core/Route'
import HealthCheck from '@ioc:Adonis/Core/HealthCheck'

import "App/Modules/User/routes"

Route.get('/', async () => {
  const healthCheck = await HealthCheck.getReport()
  return {
    appName: 'panorama',
    healthCheck: healthCheck
  }
})
