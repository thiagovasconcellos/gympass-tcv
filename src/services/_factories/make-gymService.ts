import { PrismaGymsRepository } from '@/repositories/prisma/gyms/gymsRepository'
import { FetchGymsService } from '../gyms/fetchGymsService'
import { FetchNearbyGymsService } from '../gyms/fetchNearbyGymsService'
import { CreateGymService } from '../gyms/createGymService'

export function makeFetchGymsService() {
  const repository = new PrismaGymsRepository()
  const service = new FetchGymsService(repository)

  return service
}

export function makeFetchNearbyGymsService() {
  const repository = new PrismaGymsRepository()
  const service = new FetchNearbyGymsService(repository)

  return service
}

export function makeCreateGymService() {
  const repository = new PrismaGymsRepository()
  const service = new CreateGymService(repository)

  return service
}
