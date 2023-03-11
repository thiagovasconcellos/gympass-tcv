import { Gym, Prisma } from '@prisma/client'

export interface FetchNearbyGymsParams {
  latitude: number
  longitude: number
}

export interface IGymInRepository {
  create(data: Prisma.GymCreateInput): Promise<Gym>
  findById(gymId: string): Promise<Gym | null>
  fetchGyms(query: string, page: number): Promise<Gym[]>
  fetchNearbyGyms(params: FetchNearbyGymsParams): Promise<Gym[]>
}
