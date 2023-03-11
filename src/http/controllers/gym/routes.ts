import { FastifyInstance } from 'fastify'

import { verifyJwt } from '@/http/middlewares/verifyJwt'
import { create, getGyms, getGymsNearby } from './gymController'

export async function gymRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.post('/gyms', create)
  app.get('/gyms/search', getGyms)
  app.get('/gyms/mearby', getGymsNearby)
}
