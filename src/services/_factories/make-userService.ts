import { PrismaUserRepository } from '@/repositories/prisma/users/userRepository'
import { CreateUserService } from '../users/userService'

export function makeUserService() {
  const usersRepository = new PrismaUserRepository()
  const createUserService = new CreateUserService(usersRepository)

  return createUserService
}
