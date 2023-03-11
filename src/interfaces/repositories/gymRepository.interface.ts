import { Gym, Prisma } from '@prisma/client'

export interface IGymInRepository {
  create(data: Prisma.GymCreateInput): Promise<Gym>
  findById(gymId: string): Promise<Gym | null>
}
