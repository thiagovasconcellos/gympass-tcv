import { CheckIn, Prisma } from '@prisma/client'

export interface ICheckInRepository {
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
  findById(id: string): Promise<CheckIn | null>
  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>
  findManyByUserId(userId: string, page: number): Promise<CheckIn[]>
  getCheckInCountByUserId(userId: string): Promise<number>
  save(checkIn: CheckIn): Promise<CheckIn>
}
