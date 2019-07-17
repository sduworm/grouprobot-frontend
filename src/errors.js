export class InvalidResponseFormatError extends Error {
  constructor(error) {
    super(error);
    this.name = 'InvalidResponseFormatError';
  }
}

export class InvalidTokenError extends Error {
  constructor(error) {
    super(error);
    this.name = 'InvalidTokenError';
  }
}
