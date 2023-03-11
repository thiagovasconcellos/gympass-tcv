import { PrismaUserRepository } from '@/repositories/prisma/users/userRepository'
import { CreateUserService } from '../users/userService'
import { GetUserProfileService } from '../users/getUserProfileService'
import { GetUserMetricsService } from '../users/getUserMetricsService'
import { PrismaCheckInsRepository } from '@/repositories/prisma/checkIns/checkInsRepository'

export function makeUserService() {
  const usersRepository = new PrismaUserRepository()
  const createUserService = new CreateUserService(usersRepository)

  return createUserService
}

export function makeGetUserProfileService() {
  const repository = new PrismaUserRepository()
  const service = new GetUserProfileService(repository)

  return service
}

export function makeGetUserMetricsService() {
  const repository = new PrismaCheckInsRepository()
  const service = new GetUserMetricsService(repository)

  return service
}
