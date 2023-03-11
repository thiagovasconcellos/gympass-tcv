import { IUserRepository } from '@/interfaces/repositories/userRepository.interface'
import { prisma } from '@/lib/prisma'
import { Prisma, User } from '@prisma/client'

export class PrismaUserRepository implements IUserRepository {
  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user = await prisma.user.create({
      data
    })

    return user
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        email
      }
    })

    return user
  }
}
