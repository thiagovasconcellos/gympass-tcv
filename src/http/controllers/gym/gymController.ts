import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import {
  makeCreateGymService,
  makeFetchGymsService,
  makeFetchNearbyGymsService
} from '@/services/_factories/make-gymService'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const schema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    })
  })

  const { ...gym } = schema.parse(request.body)

  const service = makeCreateGymService()

  await service.handle(gym)

  return reply.status(201).send()
}

export async function getGyms(request: FastifyRequest, reply: FastifyReply) {
  const schema = z.object({
    query: z.string(),
    page: z.coerce.number().min(1).default(1)
  })

  const { query, page } = schema.parse(request.query)

  const service = makeFetchGymsService()

  const { gyms } = await service.handle({
    query,
    page
  })

  return reply.status(200).send({
    gyms
  })
}

export async function getGymsNearby(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const schema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    })
  })

  const { latitude, longitude } = schema.parse(request.query)

  const service = makeFetchNearbyGymsService()

  const { gyms } = await service.handle({
    userLatitude: latitude,
    userLongitude: longitude
  })

  return reply.status(200).send({
    gyms
  })
}
