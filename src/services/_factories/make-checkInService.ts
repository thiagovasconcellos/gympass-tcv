import { PrismaCheckInsRepository } from '@/repositories/prisma/checkIns/checkInsRepository'
import { HandleCheckInService } from '../checkIns/handleCheckInService'
import { PrismaGymsRepository } from '@/repositories/prisma/gyms/gymsRepository'
import { FetchUserCheckInsHistoryService } from '../checkIns/fetchUserCheckInsHistoryService'
import { ValidateCheckInService } from '../checkIns/validateCheckInService'

export function makeHandleCheckInService() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const gymsRepository = new PrismaGymsRepository()
  const service = new HandleCheckInService(checkInsRepository, gymsRepository)

  return service
}

export function makeFetchUserCheckInsHistoryService() {
  const repository = new PrismaCheckInsRepository()
  const service = new FetchUserCheckInsHistoryService(repository)

  return service
}

export function makeValidateCheckInService() {
  const repository = new PrismaCheckInsRepository()
  const service = new ValidateCheckInService(repository)

  return service
}
