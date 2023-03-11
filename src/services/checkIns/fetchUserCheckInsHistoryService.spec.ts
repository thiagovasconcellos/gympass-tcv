import { describe, it, expect, beforeEach } from 'vitest'

import { InMemoryCheckInRepository } from '@/repositories/in-memory/checkIns/in-memory-checkInRepository'
import { FetchUserCheckInsHistoryService } from './fetchUserCheckInsHistoryService'

let repository: InMemoryCheckInRepository
let sut: FetchUserCheckInsHistoryService

describe('Fetch User Check-Ins History Service', async () => {
  beforeEach(async () => {
    repository = new InMemoryCheckInRepository()
    sut = new FetchUserCheckInsHistoryService(repository)
  })

  it('it should be able to fetch check ins', async () => {
    await repository.create({
      gym_id: 'gym-01',
      user_id: 'user-01'
    })

    await repository.create({
      gym_id: 'gym-02',
      user_id: 'user-01'
    })
    const { checkIns } = await sut.handle({
      userId: 'user-01',
      page: 1
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-01' }),
      expect.objectContaining({ gym_id: 'gym-02' })
    ])
  })

  it('it should be able to fetch check ins with pagination', async () => {
    for (let index = 1; index <= 22; index++) {
      await repository.create({
        gym_id: `gym-${index}`,
        user_id: 'user-01'
      })
    }

    const { checkIns } = await sut.handle({
      userId: 'user-01',
      page: 2
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-21' }),
      expect.objectContaining({ gym_id: 'gym-22' })
    ])
  })
})
