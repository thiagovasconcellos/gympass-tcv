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

    const { user: loggedUser } = await authService.handle(user)

    const token = await reply.jwtSign(
      {
        role: loggedUser.role
      },
      {
        sign: {
          sub: loggedUser.id
        }
      }
    )

    const refreshToken = await reply.jwtSign(
      {
        role: loggedUser.role
      },
      {
        sign: {
          sub: loggedUser.id,
          expiresIn: '7d'
        }
      }
    )

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true
      })
      .status(200)
      .send({
        token
      })
  } catch (error) {
    if (error instanceof InvalidCredentialError) {
      reply.status(400).send({ message: error.message })
    }

    throw error
  }
}

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify({
    onlyCookie: true
  })

  const { role } = request.user

  const token = await reply.jwtSign(
    {
      role
    },
    {
      sign: {
        sub: request.user.sub
      }
    }
  )

  const refreshToken = await reply.jwtSign(
    {
      role
    },
    {
      sign: {
        sub: request.user.sub,
        expiresIn: '7d'
      }
    }
  )

  return reply
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      secure: true,
      sameSite: true,
      httpOnly: true
    })
    .status(200)
    .send({
      token
    })
}
