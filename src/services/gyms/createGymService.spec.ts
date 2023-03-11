import { InMemoryGymRepository } from '@/repositories/in-memory/gyms/in-memory-gymRepository'
import { describe, it, expect, beforeEach } from 'vitest'
import { CreateGymService } from './createGymService'

let repository: InMemoryGymRepository
let sut: CreateGymService

describe('Create Gym Service', () => {
  beforeEach(() => {
    repository = new InMemoryGymRepository()
    sut = new CreateGymService(repository)
  })

  it('it should be able to create gym', async () => {
    const { gym } = await sut.handle({
      title: 'Awesome Gym',
      description: null,
      phone: null,
      latitude: 0,
      longitude: 0
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
