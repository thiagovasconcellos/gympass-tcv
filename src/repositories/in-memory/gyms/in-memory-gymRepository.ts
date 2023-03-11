import { randomUUID } from 'node:crypto'

import { Gym, Prisma } from '@prisma/client'
import { IGymInRepository } from '@/interfaces/repositories/gymRepository.interface'
import { Decimal } from '@prisma/client/runtime'

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
}
