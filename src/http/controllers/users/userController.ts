import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { EmailAlreadyExistsError } from '@/errors/email-already-exists-error'
import { makeUserService } from '@/services/_factories/make-userService'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const schema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6)
  })

  const { ...user } = schema.parse(request.body)

  try {
    const createUserService = makeUserService()

    await createUserService.handle(user)
  } catch (error) {
    if (error instanceof EmailAlreadyExistsError) {
      reply.status(409).send({ message: error.message })
    }

    throw error
  }

  return reply.status(201).send()
}
