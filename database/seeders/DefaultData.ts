import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

export default class DefaultDataSeeder extends BaseSeeder {
  public async run () {
    const DefaultData = (await import('App/Services/DefaultData')).default
    const message = await DefaultData.run()
    console.log(message)
  }
}
