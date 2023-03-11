import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

import { InMemoryCheckInRepository } from '@/repositories/in-memory/checkIns/in-memory-checkInRepository'
import { HandleCheckInService } from './handleCheckInService'
import { InMemoryGymRepository } from '@/repositories/in-memory/gyms/in-memory-gymRepository'
import { Decimal } from '@prisma/client/runtime'
import { TooManyCheckInsError } from '@/errors/too-many-checkins-error'
import { MaxDistanceError } from '@/errors/max-distance-error'

let repository: InMemoryCheckInRepository
let gymRepository: InMemoryGymRepository
let sut: HandleCheckInService

describe('CheckIn Service', () => {
  beforeEach(async () => {
    repository = new InMemoryCheckInRepository()
    gymRepository = new InMemoryGymRepository()
    sut = new HandleCheckInService(repository, gymRepository)

    await gymRepository.create({
      id: 'gym-01',
      title: 'Awesome Gym',
      description: '',
      phone: '',
      latitude: -27.2092052,
      longitude: -49.6401091,
      created_at: null,
      updated_at: null
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('it should be able to check in', async () => {
    const { checkIn } = await sut.handle({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -27.2092052,
      userLongitude: -49.6401091
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('it should not be able to check in twice on the same day', async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 9, 0, 0))

    await sut.handle({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -27.2092052,
      userLongitude: -49.6401091
    })

    await expect(() =>
      sut.handle({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -27.2092052,
        userLongitude: -49.6401091
      })
    ).rejects.toBeInstanceOf(TooManyCheckInsError)
  })

  it('it should not able to check in twice on different dates', async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 9, 0, 0))

    await sut.handle({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -27.2092052,
      userLongitude: -49.6401091
    })

    vi.setSystemTime(new Date(2023, 0, 21, 9, 0, 0))

    const { checkIn } = await sut.handle({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -27.2092052,
      userLongitude: -49.6401091
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('it should not be able to check in on a distant gym', async () => {
    gymRepository.db.push({
      id: 'gym-02',
      title: 'Awesome Gym 2',
      description: '',
      phone: '',
      latitude: new Decimal(-27.0747279),
      longitude: new Decimal(-49.4889672),
      created_at: null,
      updated_at: null
    })

    await expect(() =>
      sut.handle({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -27.2092052,
        userLongitude: -49.6401091
      })
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
