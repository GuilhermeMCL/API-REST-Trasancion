import fastify from 'fastify'
import { knex } from './database'

const app = fastify()

app.get('/', async () => {
  const data = knex('sqlite_schema').select('*')
  return data
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('Server is running on http://localhost:3333')
  })
