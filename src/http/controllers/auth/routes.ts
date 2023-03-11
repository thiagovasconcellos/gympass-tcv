import { FastifyInstance } from 'fastify'

import { authenticate, refresh } from './authController'

export async function authRoutes(app: FastifyInstance) {
  app.post('/sessions', authenticate)
  app.patch('/refresh', refresh)
}
