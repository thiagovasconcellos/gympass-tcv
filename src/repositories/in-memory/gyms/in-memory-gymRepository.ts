import { randomUUID } from 'node:crypto'

import { Gym, Prisma } from '@prisma/client'
import {
  FetchNearbyGymsParams,
  IGymInRepository
} from '@/interfaces/repositories/gymRepository.interface'
import { Decimal } from '@prisma/client/runtime'
import { getDistanceBetweenCoordinates } from '@/helpers/getDistanceBetweenCoordinates'

export class InMemoryGymRepository implements IGymInRepository {
  public db: Gym[] = []

  async create(data: Prisma.GymCreateInput): Promise<Gym> {
    const gym: Gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone,
      latitude: new Decimal(data.latitude.toString()),
      longitude: new Decimal(data.longitude.toString()),
      created_at: new Date(),
      updated_at: null
    }

    this.db.push(gym)

    return gym
  }

  async findById(gymId: string): Promise<Gym | null> {
    const gym = this.db.find((item) => item.id === gymId)

    if (!gym) {
      return null
    }

    return gym
  }

  async fetchGyms(query: string, page: number): Promise<Gym[]> {
    return this.db
      .filter((item) => item.title.includes(query))
      .slice((page - 1) * 20, page * 20)
  }

  async fetchNearbyGyms(params: FetchNearbyGymsParams): Promise<Gym[]> {
    return this.db.filter((item) => {
      const distance = getDistanceBetweenCoordinates(
        { latitude: params.latitude, longitude: params.longitude },
        {
          latitude: item.latitude.toNumber(),
          longitude: item.longitude.toNumber()
        }
      )

      return distance < 10
    })
  }
}
