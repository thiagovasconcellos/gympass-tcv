export class ResourceNotExists extends Error {
  constructor(resource: string) {
    super(`${resource} does not exists`)
  }
}
