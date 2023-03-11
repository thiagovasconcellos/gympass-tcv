import fastify from 'fastify'
import { ZodError } from 'zod'

import { routes } from './http/routes'
import { env } from './env'

export const app = fastify()

app.register(routes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Bad Request', issues: error.format() })
  }

  if (env.NOD_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: LOG EXTERNAL
  }

  return reply.status(500).send({ message: 'Invalid error' })
})
