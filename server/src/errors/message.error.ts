
interface Message{
  NotFoundError: string;
  ConflictError: string;
  ConfigureError: string;
  CredentialError: string;
  UnauthorizedError: string;
  DatabaseConnectError: string;
  TemporaryLockedError: string;
  PermanentlyLockedError: string;
  InternalServiceError: string;
  EmailError: string;
  BadRequestError:string;
  ForbiddenError: string;
  UnprocessableError: string;
  RedirectError:string;
}





export const ErrorMessage: Message = {
  UnprocessableError: '',
  RedirectError:'Welcome! As this is your first login, please take a moment to update your default password to something more secure',
  ForbiddenError: 'ACCESS DENIED: You do not have the required authorization to perform this action',
  BadRequestError: 'Unable to process request. Please try again or fell free to contact us if the problem persists',
  EmailError: 'Error sending email',
  UnauthorizedError: 'Access denied',
  CredentialError: 'Incorrect email or password',
  NotFoundError: 'The requested resources could not be found',
  ConflictError: 'This name is already in use. Please choose a different name',
  ConfigureError:  'This error may be due to missing or incorrect server configuration settings',
  DatabaseConnectError: 'Database connection timeout. Please check your network connection or contact your administrator',
  TemporaryLockedError: "Oops! Too many wrong tries. Your account's on a short break for security. Try again in a bit!",
  PermanentlyLockedError: "Heads up! Your account's locked for security. Please reset your password to get back in.",
  InternalServiceError: 'Oops, something went wrong try refreshing the page or fell free to contact us if the problem persists',
}