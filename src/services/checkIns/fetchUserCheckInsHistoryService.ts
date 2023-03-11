import { ICheckInRepository } from '@/interfaces/repositories/checkInRepository.interface'
import { CheckIn } from '@prisma/client'

interface IRequest {
  userId: string
  page: number
}

interface IResponse {
  checkIns: CheckIn[]
}

export class FetchUserCheckInsHistoryService {
  constructor(private checkInRepository: ICheckInRepository) {}

  async handle({ userId, page }: IRequest): Promise<IResponse> {
    const checkIns = await this.checkInRepository.findManyByUserId(userId, page)

    return { checkIns }
  }
}
