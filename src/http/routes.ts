import { FastifyInstance } from 'fastify'
import { create } from './controllers/users/userController'
import { authenticate } from './controllers/auth/authController'

export async function routes(app: FastifyInstance) {
  app.post('/users', create)
  app.post('/sessions', authenticate)
}
