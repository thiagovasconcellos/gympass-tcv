import { MaxDistanceError } from '@/errors/max-distance-error'
import { ResourceNotExists } from '@/errors/resource-not-exists-error'
import { TooManyCheckInsError } from '@/errors/too-many-checkins-error'
import { getDistanceBetweenCoordinates } from '@/helpers/getDistanceBetweenCoordinates'
import { ICheckInRepository } from '@/interfaces/repositories/checkInRepository.interface'
import { IGymInRepository } from '@/interfaces/repositories/gymRepository.interface'

import { CheckIn } from '@prisma/client'

interface IRequest {
  userId: string
  gymId: string
  userLatitude: number
  userLongitude: number
}

interface IResponse {
  checkIn: CheckIn
}

export class HandleCheckInService {
  constructor(
    private checkInRepository: ICheckInRepository,
    private gymRepository: IGymInRepository
  ) {}

  async handle({
    userId,
    gymId,
    userLatitude,
    userLongitude
  }: IRequest): Promise<IResponse> {
    const gym = await this.gymRepository.findById(gymId)

    if (!gym) {
      throw new ResourceNotExists('Gym')
    }

    const distance = getDistanceBetweenCoordinates(
      { latitude: userLatitude, longitude: userLongitude },
      { latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() }
    )

    const MAX_DISTANCE_IN_KILOMETERS = 0.1

    if (distance > MAX_DISTANCE_IN_KILOMETERS) {
      throw new MaxDistanceError()
    }

    const checkInOnSameDate = await this.checkInRepository.findByUserIdOnDate(
      userId,
      new Date()
    )

    if (checkInOnSameDate) {
      throw new TooManyCheckInsError()
    }

    const checkIn = await this.checkInRepository.create({
      user_id: userId,
      gym_id: gymId
    })

    return { checkIn }
  }
}
