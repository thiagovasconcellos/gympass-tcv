import { IGymInRepository } from '@/interfaces/repositories/gymRepository.interface'
import { Gym } from '@prisma/client'

interface IRequest {
  query: string
  page: number
}

interface IResponse {
  gyms: Gym[]
}

export class FetchGymsService {
  constructor(private repository: IGymInRepository) {}

  async handle({ query, page }: IRequest): Promise<IResponse> {
    const gyms = await this.repository.fetchGyms(query, page)

    return { gyms }
  }
}
