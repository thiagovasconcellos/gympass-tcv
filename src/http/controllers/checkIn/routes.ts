import { FastifyInstance } from 'fastify'

import { verifyJwt } from '@/http/middlewares/verifyJwt'
import {
  create,
  getCheckInHistory,
  getCheckInMetrics,
  validateCheckIn
} from './checkInController'

export async function checkInRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.post('/gyms/:gymId/check-in', create)
  app.patch('/check-ins/:checkInId/validate', validateCheckIn)

  app.get('/check-ins/metrics', getCheckInMetrics)
  app.get('/check-ins/history', getCheckInHistory)
}
