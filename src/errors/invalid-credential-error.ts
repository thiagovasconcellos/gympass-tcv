export class InvalidCredentialError extends Error {
  constructor() {
    super('Credentials does not match')
  }
}
