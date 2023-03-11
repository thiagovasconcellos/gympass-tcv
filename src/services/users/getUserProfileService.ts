import { ResourceNotExists } from '@/errors/resource-not-exists-error'
import { IUserRepository } from '@/interfaces/repositories/userRepository.interface'
import { User } from '@prisma/client'

interface IRequest {
  userId: string
}

interface IResponse {
  user: User
}

export class GetUserProfileService {
  constructor(private usersRepository: IUserRepository) {}

  async handle({ userId }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotExists('User')
    }

    return { user }
  }
}
