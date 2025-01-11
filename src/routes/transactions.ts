import { FastifyInstance } from "fastify"
import { knex } from "../database"
import { z } from 'zod'
import { randomUUID } from "node:crypto"

export async function transactionsRoutes(app: FastifyInstance) {

  app.get ('/summary', async (request, reply) => {
    const sumary = await knex('transactions').sum('amount' ,{ as : 'amount'}).first()

    return { sumary }
  })


  app.get('/', async (request, reply) => {
    const transactions = await knex('transactions').select('*')
    return { transactions }
  })

  app.get('/:id', async (request, reply) => {
    const getTransactionByIdParamsSchema = z.object({
      id: z.string().uuid()
    })

    const { id } = getTransactionByIdParamsSchema.parse(request.params)

    const trasaction = await knex('transactions').select('*').where('id', id).first()
    return { trasaction }

  })

  app.post('/', async (request, reply) => {
    //{ title , amount , type : 'credit' | 'debit'    }
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit'])
    })
    const { title, amount, type } = createTransactionBodySchema.parse(request.body)
    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
    })
    return reply.status(201).send()
  })
}