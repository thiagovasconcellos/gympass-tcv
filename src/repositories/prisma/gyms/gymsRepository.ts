import {
  FetchNearbyGymsParams,
  IGymInRepository
} from '@/interfaces/repositories/gymRepository.interface'
import { prisma } from '@/lib/prisma'
import { Prisma, Gym } from '@prisma/client'

export class PrismaGymsRepository implements IGymInRepository {
  async create(data: Prisma.GymCreateInput): Promise<Gym> {
    return prisma.gym.create({
      data
    })
  }
  async findById(gymId: string): Promise<Gym | null> {
    return prisma.gym.findUnique({
      where: {
        id: gymId
      }
    })
  }
  async fetchGyms(query: string, page: number): Promise<Gym[]> {
    return prisma.gym.findMany({
      where: {
        title: {
          contains: query
        }
      },
      take: 20,
      skip: (page - 1) * 20
    })
  }
  async fetchNearbyGyms({
    latitude,
    longitude
  }: FetchNearbyGymsParams): Promise<Gym[]> {
    const nearbyGyms = await prisma.$queryRaw<Gym[]>`
      SELECT * from gyms
      WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `

    return nearbyGyms
  }
}
