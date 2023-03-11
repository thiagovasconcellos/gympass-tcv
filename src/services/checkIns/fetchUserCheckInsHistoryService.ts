import { ICheckInRepository } from '@/interfaces/repositories/checkInRepository.interface'
import { CheckIn } from '@prisma/client'

interface IRequest {
  userId: string
}

interface IResponse {
  checkIns: CheckIn[]
}

export class FetchUserCheckinsHistoryService {
  constructor(private checkInRepository: ICheckInRepository) {}

  async handle({ userId }: IRequest): Promise<IResponse> {
    const checkIns = await this.checkInRepository.findManyByUserId(userId)

    return { checkIns }
  }
}
