export class TooManyCheckInsError extends Error {
  constructor() {
    super('You are not allowed to check in twice on the same day on this gym')
  }
}
