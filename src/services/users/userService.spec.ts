import { describe, it, expect, beforeEach } from 'vitest'
import { CreateUserService } from './userService'
import { compare } from 'bcryptjs'
import { InMemoryUserRespository } from '@/repositories/in-memory/users/in-memory-userRepository'
import { EmailAlreadyExistsError } from '@/errors/email-already-exists-error'

let sut: CreateUserService

describe('User Service', () => {
  beforeEach(() => {
    sut = new CreateUserService(new InMemoryUserRespository())
  })

  it('should hash user password before saving it to database', async () => {
    const { user } = await sut.handle({
      name: 'John Doe',
      email: 'john.doe@email.com',
      password: '123456'
    })

    const isHashSucessfully = await compare('123456', user.password_hash)

    expect(isHashSucessfully).toBe(true)
  })

  it('email should be unique', async () => {
    const email = 'john.doe@email.com'

    await sut.handle({
      name: 'John Doe',
      email,
      password: '123456'
    })

    await expect(() =>
      sut.handle({
        name: 'John Doe',
        email,
        password: '123456'
      })
    ).rejects.toBeInstanceOf(EmailAlreadyExistsError)
  })

  it('should be able to register a new user', async () => {
    const { user } = await sut.handle({
      name: 'John Doe',
      email: 'john.doe@email.com',
      password: '123456'
    })

    expect(user.id).toEqual(expect.any(String))
  })
})
