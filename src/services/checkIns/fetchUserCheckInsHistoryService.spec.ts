import { describe, it, expect, beforeEach } from 'vitest'

import { InMemoryCheckInRepository } from '@/repositories/in-memory/checkIns/in-memory-checkInRepository'
import { FetchUserCheckinsHistoryService } from './fetchUserCheckInsHistoryService'

let repository: InMemoryCheckInRepository
let sut: FetchUserCheckinsHistoryService

describe('Fetch User Check-Ins History Service', async () => {
  beforeEach(async () => {
    repository = new InMemoryCheckInRepository()
    sut = new FetchUserCheckinsHistoryService(repository)
  })

  await repository.create({
    gym_id: 'gym-01',
    user_id: 'user-01'
  })

  await repository.create({
    gym_id: 'gym-02',
    user_id: 'user-01'
  })

  it('it should be able to fetch check ins', async () => {
    const { checkIns } = await sut.handle({
      userId: 'gym-01'
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-01' }),
      expect.objectContaining({ gym_id: 'gym-02' })
    ])
  })
})
