import { ICheckInRepository } from '@/interfaces/repositories/checkInRepository.interface'

interface IRequest {
  userId: string
}

interface IResponse {
  checkInsCount: number
}

export class GetUserMetricsService {
  constructor(private checkInRepository: ICheckInRepository) {}

  async handle({ userId }: IRequest): Promise<IResponse> {
    const checkInsCount = await this.checkInRepository.getCheckInCountByUserId(
      userId
    )

    return { checkInsCount }
  }
}
