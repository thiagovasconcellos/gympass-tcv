import { describe, it, expect, beforeEach } from 'vitest'

import { hash } from 'bcryptjs'
import { InMemoryUserRespository } from '@/repositories/in-memory/users/in-memory-userRepository'
import { AuthService } from './authService'
import { InvalidCredentialError } from '@/errors/invalid-credential-error'

let userRepository: InMemoryUserRespository
let sut: AuthService

describe('Authentication Service', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRespository()
    sut = new AuthService(userRepository)
  })

  it('it should be able to authenticate', async () => {
    await userRepository.create({
      name: 'John Doe',
      email: 'john.doe@email.com',
      password_hash: await hash('123456', 6)
    })

    const { user } = await sut.handle({
      email: 'john.doe@email.com',
      password: '123456'
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('it should not be able to authenticate with invalid e-mail', async () => {
    await expect(() =>
      sut.handle({
        email: 'john.doe@email.com',
        password: '123456'
      })
    ).rejects.toBeInstanceOf(InvalidCredentialError)
  })

  it('it should not be able to authenticate with invalid password', async () => {
    await userRepository.create({
      name: 'John Doe',
      email: 'john.doe@email.com',
      password_hash: await hash('1234567', 6)
    })

    await expect(() =>
      sut.handle({
        email: 'john.doe@email.com',
        password: '123456'
      })
    ).rejects.toBeInstanceOf(InvalidCredentialError)
  })
})
