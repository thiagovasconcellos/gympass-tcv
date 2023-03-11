import { InvalidCredentialError } from '@/errors/invalid-credential-error'
import { IUserRepository } from '@/interfaces/repositories/userRepository.interface'
import { User } from '@prisma/client'
import { compare } from 'bcryptjs'

interface IAuthRequest {
  email: string
  password: string
}

interface IAuthResponse {
  user: User
}

export class AuthService {
  constructor(private usersRepository: IUserRepository) {}

  async handle({ email, password }: IAuthRequest): Promise<IAuthResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentialError()
    }

    const passwordMatches = await compare(password, user.password_hash)

    if (!passwordMatches) {
      throw new InvalidCredentialError()
    }

    return { user }
  }
}
