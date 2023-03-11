import { IGymInRepository } from '@/interfaces/repositories/gymRepository.interface'
import { Gym } from '@prisma/client'

interface IRequest {
  userLatitude: number
  userLongitude: number
}

interface IResponse {
  gyms: Gym[]
}

export class FetchNearbyGymsService {
  constructor(private repository: IGymInRepository) {}

  async handle({ userLatitude, userLongitude }: IRequest): Promise<IResponse> {
    const gyms = await this.repository.fetchNearbyGyms({
      latitude: userLatitude,
      longitude: userLongitude
    })

    return { gyms }
  }
}
