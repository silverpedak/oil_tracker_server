import { Request } from 'express';
import { JwtPayload } from './jwt_payload.model';

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}
