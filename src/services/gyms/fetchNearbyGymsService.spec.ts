import { describe, it, expect, beforeEach } from 'vitest'

import { InMemoryGymRepository } from '@/repositories/in-memory/gyms/in-memory-gymRepository'
import { FetchNearbyGymsService } from './fetchNearbyGymsService'

let repository: InMemoryGymRepository
let sut: FetchNearbyGymsService

describe('Fetch Nearby Gyms Service', async () => {
  beforeEach(async () => {
    repository = new InMemoryGymRepository()
    sut = new FetchNearbyGymsService(repository)
  })

  it('it should be able to fetch nearby gyms', async () => {
    await repository.create({
      title: 'Nearby Gym',
      description: null,
      phone: null,
      latitude: -27.2092052,
      longitude: -49.6401091
    })

    await repository.create({
      title: 'Far Far Away Gym',
      description: null,
      phone: null,
      latitude: -27.0610928,
      longitude: -49.5229501
    })

    const { gyms } = await sut.handle({
      userLatitude: -27.2092052,
      userLongitude: -49.6401091
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Nearby Gym' })])
  })
})
