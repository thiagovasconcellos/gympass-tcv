import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

import { InMemoryCheckInRepository } from '@/repositories/in-memory/checkIns/in-memory-checkInRepository'
import { ValidateCheckInService } from './validateCheckInService'
import { ResourceNotExists } from '@/errors/resource-not-exists-error'
import { LateCheckInError } from '@/errors/late-checkin-error'

let repository: InMemoryCheckInRepository
let sut: ValidateCheckInService

describe('Validate CheckIn Service', () => {
  beforeEach(async () => {
    repository = new InMemoryCheckInRepository()
    sut = new ValidateCheckInService(repository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('it should be able to validate the check-in', async () => {
    const newCheckIn = await repository.create({
      gym_id: 'gym-01',
      user_id: 'user-01'
    })

    const { checkIn } = await sut.handle({
      checkInId: newCheckIn.id
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
    expect(repository.db[0].validated_at).toEqual(expect.any(Date))
  })

  it('it should not be able to validate an unvalid check-in', async () => {
    await expect(() =>
      sut.handle({
        checkInId: 'invalid-id'
      })
    ).rejects.toBeInstanceOf(ResourceNotExists)
  })

  it('it should not be able to validate the check-in after 20 minutes passed', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40))

    const createdCheckIn = await repository.create({
      gym_id: 'gym-01',
      user_id: 'user-01'
    })

    const twentyOneMinutesInMs = 1000 * 60 * 21

    vi.advanceTimersByTime(twentyOneMinutesInMs)

    await expect(() =>
      sut.handle({
        checkInId: createdCheckIn.id
      })
    ).rejects.toBeInstanceOf(LateCheckInError)
  })
})
