import { IGymInRepository } from '@/interfaces/repositories/gymRepository.interface'
import { Gym } from '@prisma/client'

interface IRequest {
  title: string
  description: string | null
  phone: string | null
  latitude: number
  longitude: number
}

interface IResponse {
  gym: Gym
}

export class CreateGymService {
  constructor(private repository: IGymInRepository) {}

  async handle({
    title,
    description,
    phone,
    latitude,
    longitude
  }: IRequest): Promise<IResponse> {
    const gym = await this.repository.create({
      title,
      description,
      phone,
      latitude,
      longitude
    })

    return { gym }
  }
}
