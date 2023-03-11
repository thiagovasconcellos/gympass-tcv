import { FastifyInstance } from 'fastify'

import { verifyJwt } from '@/http/middlewares/verifyJwt'
import { create, getGyms, getGymsNearby } from './gymController'
import { verifyUserRole } from '@/http/middlewares/verifyUserRole'

export async function gymRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.post('/gyms', { onRequest: [verifyUserRole('ADMIN')] }, create)
  app.get('/gyms/search', getGyms)
  app.get('/gyms/mearby', getGymsNearby)
}
