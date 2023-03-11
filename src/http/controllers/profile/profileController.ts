import { makeGetUserProfileService } from '@/services/_factories/make-userService'
import { FastifyRequest, FastifyReply } from 'fastify'

export async function getProfile(request: FastifyRequest, reply: FastifyReply) {
  const getUserProfile = makeGetUserProfileService()

  const { user } = await getUserProfile.handle({
    userId: request.user.sub
  })

  return reply.status(200).send({
    user: {
      ...user,
      password_hash: undefined
    }
  })
}
