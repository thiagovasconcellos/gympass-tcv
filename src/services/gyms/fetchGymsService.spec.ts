import { describe, it, expect, beforeEach } from 'vitest'

import { InMemoryGymRepository } from '@/repositories/in-memory/gyms/in-memory-gymRepository'
import { FetchGymsService } from './fetchGymsService'

let repository: InMemoryGymRepository
let sut: FetchGymsService

describe('Fetch Gyms Service', async () => {
  beforeEach(async () => {
    repository = new InMemoryGymRepository()
    sut = new FetchGymsService(repository)
  })

  it('it should be able to fetch gyms by title', async () => {
    await repository.create({
      title: 'Awesome Gym',
      description: null,
      phone: null,
      latitude: 0,
      longitude: 0
    })

    await repository.create({
      title: 'Very nice Gym',
      description: null,
      phone: null,
      latitude: 0,
      longitude: 0
    })
    const { gyms } = await sut.handle({
      query: 'Awesome',
      page: 1
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Awesome Gym' })])
  })

  it('it should be able to fetch check ins with pagination', async () => {
    for (let index = 1; index <= 22; index++) {
      await repository.create({
        title: `Very nice Gym ${index}`,
        description: null,
        phone: null,
        latitude: 0,
        longitude: 0
      })
    }

    const { gyms } = await sut.handle({
      query: 'Very nice',
      page: 2
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Very nice Gym 21' }),
      expect.objectContaining({ title: 'Very nice Gym 22' })
    ])
  })
})
