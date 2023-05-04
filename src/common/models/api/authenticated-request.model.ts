import { Request } from 'express';
import { JwtPayload } from './jwt-payload.model';

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}
