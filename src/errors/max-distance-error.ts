export class MaxDistanceError extends Error {
  constructor() {
    super(
      'You are not allowed to check in this gym because you are too far away.'
    )
  }
}
