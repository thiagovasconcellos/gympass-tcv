import { describe, it, expect, beforeEach } from 'vitest'

import { InMemoryCheckInRepository } from '@/repositories/in-memory/checkIns/in-memory-checkInRepository'
import { GetUserMetricsService } from './getUserMetricsService'

let repository: InMemoryCheckInRepository
let sut: GetUserMetricsService

describe('Get User Metrics Service', async () => {
  beforeEach(async () => {
    repository = new InMemoryCheckInRepository()
    sut = new GetUserMetricsService(repository)
  })

  it('it should be able to get user check-ins count', async () => {
    await repository.create({
      gym_id: 'gym-01',
      user_id: 'user-01'
    })

    await repository.create({
      gym_id: 'gym-02',
      user_id: 'user-01'
    })
    const { checkInsCount } = await sut.handle({
      userId: 'user-01'
    })

    expect(checkInsCount).toEqual(2)
  })
})
