import {UserProfile} from '@loopback/security';

export interface UserSecurity extends UserProfile {
  id: number;
  role: string;
}
