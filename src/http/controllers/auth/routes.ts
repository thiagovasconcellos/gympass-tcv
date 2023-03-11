import { FastifyInstance } from 'fastify'

import { authenticate } from './authController'

export async function authRoutes(app: FastifyInstance) {
  app.post('/sessions', authenticate)
}
