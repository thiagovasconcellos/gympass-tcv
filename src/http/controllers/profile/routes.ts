import { FastifyInstance } from 'fastify'

import { getProfile } from './profileController'
import { verifyJwt } from '@/http/middlewares/verifyJwt'

export async function profileRoutes(app: FastifyInstance) {
  app.get('/me', { onRequest: [verifyJwt] }, getProfile)
}
