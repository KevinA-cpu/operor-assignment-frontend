import { IMeeting } from './IMeeting';

export interface IUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  ip_address: string;
  days: number;
  created_at: string;
  days_without_meetings: number;
  meetings: IMeeting[];
}
