import fastify from 'fastify'
import { ZodError } from 'zod'

import { env } from './env'
import { fastifyJwt } from '@fastify/jwt'
import { gymRoutes } from './http/controllers/gym/routes'
import { userRoutes } from './http/controllers/users/routes'
import { profileRoutes } from './http/controllers/profile/routes'
import { authRoutes } from './http/controllers/auth/routes'
import { checkInRoutes } from './http/controllers/checkIn/routes'
import { MaxDistanceError } from './errors/max-distance-error'

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET
})

app.register(userRoutes)
app.register(authRoutes)
app.register(profileRoutes)
app.register(gymRoutes)
app.register(checkInRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Bad Request', issues: error.format() })
  }

  if (error instanceof MaxDistanceError) {
    return reply
      .status(400)
      .send({ message: 'Bad Request', issues: error.message })
  }

  if (env.NOD_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: LOG EXTERNAL
  }

  return reply.status(500).send({ message: 'Invalid error' })
})
