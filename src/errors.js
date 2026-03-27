export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

export class NotFoundDirectoryError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundDirectoryError";
  }
}

export class NotFoundCommandError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotDFoundCommandError";
  }
}

export class PermissionError extends Error {
  constructor(message) {
    super(message);
    this.name = "PermissionError";
  }
}

export class FileAlreadyExistsError extends Error {
  constructor(message) {
    super(message);
    this.name = "FileAlreadyExistsError";
  }
}

export class NotFoundFileError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundFileError";
  }
}
