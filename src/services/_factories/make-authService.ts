import { PrismaUserRepository } from '@/repositories/prisma/users/userRepository'
import { AuthService } from '../auth/authService'

export function makeAuthService() {
  const usersRepository = new PrismaUserRepository()
  const authService = new AuthService(usersRepository)

  return authService
}
