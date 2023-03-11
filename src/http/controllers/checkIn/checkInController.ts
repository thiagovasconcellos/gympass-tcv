import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import {
  makeFetchUserCheckInsHistoryService,
  makeHandleCheckInService,
  makeValidateCheckInService
} from '@/services/_factories/make-checkInService'
import { makeGetUserMetricsService } from '@/services/_factories/make-userService'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    gymId: z.string().uuid()
  })
  const schema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    })
  })

  const { latitude, longitude } = schema.parse(request.body)
  const { gymId } = paramsSchema.parse(request.params)

  const service = makeHandleCheckInService()

  await service.handle({
    gymId,
    userId: request.user.sub,
    userLatitude: latitude,
    userLongitude: longitude
  })

  return reply.status(201).send()
}

export async function getCheckInHistory(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const schema = z.object({
    page: z.coerce.number().min(1).default(1)
  })

  const { page } = schema.parse(request.query)

  const service = makeFetchUserCheckInsHistoryService()

  const { checkIns } = await service.handle({
    userId: request.user.sub,
    page
  })

  return reply.status(200).send({
    checkIns
  })
}

export async function getCheckInMetrics(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const service = makeGetUserMetricsService()

  const { checkInsCount } = await service.handle({
    userId: request.user.sub
  })

  return reply.status(200).send({
    checkInsCount
  })
}

export async function validateCheckIn(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const paramsSchema = z.object({
    checkInId: z.string().uuid()
  })
  const { checkInId } = paramsSchema.parse(request.params)

  const service = makeValidateCheckInService()

  await service.handle({
    checkInId
  })

  return reply.status(204).send()
}
