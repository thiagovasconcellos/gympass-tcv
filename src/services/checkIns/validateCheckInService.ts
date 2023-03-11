import { LateCheckInError } from '@/errors/late-checkin-error'
import { ResourceNotExists } from '@/errors/resource-not-exists-error'
import { ICheckInRepository } from '@/interfaces/repositories/checkInRepository.interface'

import { CheckIn } from '@prisma/client'
import dayjs from 'dayjs'

interface IRequest {
  checkInId: string
}

interface IResponse {
  checkIn: CheckIn
}

export class ValidateCheckInService {
  constructor(private checkInRepository: ICheckInRepository) {}

  async handle({ checkInId }: IRequest): Promise<IResponse> {
    const checkIn = await this.checkInRepository.findById(checkInId)

    if (!checkIn) {
      throw new ResourceNotExists('Check In')
    }

    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      'minutes'
    )

    if (distanceInMinutesFromCheckInCreation > 20) {
      throw new LateCheckInError()
    }

    checkIn.validated_at = new Date()

    await this.checkInRepository.save(checkIn)

    return { checkIn }
  }
}
