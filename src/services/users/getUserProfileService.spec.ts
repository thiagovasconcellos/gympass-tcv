import { describe, it, expect, beforeEach } from 'vitest'

import { hash } from 'bcryptjs'
import { InMemoryUserRespository } from '@/repositories/in-memory/users/in-memory-userRepository'
import { GetUserProfileService } from './getUserProfileService'
import { ResourceNotExists } from '@/errors/resource-not-exists-error'

let userRepository: InMemoryUserRespository
let sut: GetUserProfileService

describe('Get User Profile Service', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRespository()
    sut = new GetUserProfileService(userRepository)
  })

  it('it should be able to retrieve user profile', async () => {
    const createdUser = await userRepository.create({
      name: 'John Doe',
      email: 'john.doe@email.com',
      password_hash: await hash('123456', 6)
    })

    const { user } = await sut.handle({
      userId: createdUser.id
    })

    expect(user.id).toEqual(expect.any(String))
    expect(user.name).toEqual('John Doe')
  })

  it('it should not be able to retrieve user profile with invalid Id', async () => {
    await expect(() =>
      sut.handle({
        userId: 'invalid-id'
      })
    ).rejects.toBeInstanceOf(ResourceNotExists)
  })
})
