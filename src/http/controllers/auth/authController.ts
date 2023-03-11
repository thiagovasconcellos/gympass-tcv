import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { InvalidCredentialError } from '@/errors/invalid-credential-error'
import { makeAuthService } from '@/services/_factories/make-authService'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
  })

  const { ...user } = authenticateBodySchema.parse(request.body)

  try {
    const authService = makeAuthService()

    await authService.handle(user)
  } catch (error) {
    if (error instanceof InvalidCredentialError) {
      reply.status(400).send({ message: error.message })
    }

    throw error
  }

  return reply.status(200).send()
}
