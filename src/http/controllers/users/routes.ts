import { FastifyInstance } from 'fastify'

import { create } from './userController'

export async function userRoutes(app: FastifyInstance) {
  app.post('/users', create)
}
