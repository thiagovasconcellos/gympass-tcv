import { randomUUID } from 'node:crypto'

import { ICheckInRepository } from '@/interfaces/repositories/checkInRepository.interface'
import { CheckIn, Prisma } from '@prisma/client'
import dayjs from 'dayjs'

export class InMemoryCheckInRepository implements ICheckInRepository {
  public db: CheckIn[] = []

  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkIn: CheckIn = {
      id: randomUUID(),
      created_at: new Date(),
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      user_id: data.user_id,
      gym_id: data.gym_id
    }

    this.db.push(checkIn)

    return checkIn
  }

  async findByUserIdOnDate(
    userId: string,
    date: Date
  ): Promise<CheckIn | null> {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const checkInOnSameDate = this.db.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at)

      const isOnSameDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)

      return checkIn.user_id === userId && isOnSameDate
    })

    if (!checkInOnSameDate) {
      return null
    }

    return checkInOnSameDate
  }

  async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
    return this.db
      .filter((item) => item.user_id === userId)
      .slice((page - 1) * 20, page * 20)
  }

  async getCheckInCountByUserId(userId: string): Promise<number> {
    return this.db.filter((item) => item.user_id === userId).length
  }

  async findById(id: string): Promise<CheckIn | null> {
    return this.db.find((item) => item.id === id) ?? null
  }

  async save(checkIn: CheckIn): Promise<CheckIn> {
    const checkInIndex = this.db.findIndex((item) => item.id === checkIn.id)

    if (checkInIndex >= 0) {
      this.db[checkInIndex] = checkIn
    }

    return checkIn
  }
}
