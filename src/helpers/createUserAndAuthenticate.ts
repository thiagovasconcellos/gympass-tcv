import { FastifyInstance } from 'fastify'
import request from 'supertest'

interface IResponse {
  token: string
}

export async function createUserAndAuthenticate(
  app: FastifyInstance
): Promise<IResponse> {
  await request(app.server).post('/users').send({
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: '123456'
  })

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'john.doe@example.com',
    password: '123456'
  })

  const { token } = authResponse.body

  return {
    token
  }
}
