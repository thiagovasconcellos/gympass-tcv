import { EmailAlreadyExistsError } from '@/errors/email-already-exists-error'
import { IUserRepository } from '@/interfaces/repositories/userRepository.interface'
import { User } from '@prisma/client'
import { hash } from 'bcryptjs'

interface ICreateUser {
  name: string
  email: string
  password: string
}

interface ICreateUserResponse {
  user: User
}

export class CreateUserService {
  constructor(private usersRepository: IUserRepository) {}

  async handle({
    name,
    email,
    password
  }: ICreateUser): Promise<ICreateUserResponse> {
    const password_hash = await hash(password, 6)

    const userExists = await this.usersRepository.findByEmail(email)

    if (userExists) {
      throw new EmailAlreadyExistsError()
    }

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash
    })

    return { user }
  }
}
