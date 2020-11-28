import {model, property} from '@loopback/repository';
import {Identity} from './identity.model';

@model()
export class UserSlack extends Identity {
  @property({
    type: 'string',
    required: true,
  })
  slackId: string;

  @property({
    type: 'string',
    required: true,
  })
  teamId: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'boolean',
    required: true,
  })
  deleted: boolean;

  @property({
    type: 'string',
  })
  color?: string;

  @property({
    type: 'string',
  })
  realName?: string;

  @property({
    type: 'string',
  })
  tz?: string;

  @property({
    type: 'string',
  })
  tzLabel?: string;

  @property({
    type: 'number',
  })
  tzOffset?: number;

  @property({
    type: 'string',
  })
  profileAvatarHash?: string;

  @property({
    type: 'string',
  })
  profileStatusText?: string;

  @property({
    type: 'string',
  })
  profileStatusEmoji?: string;

  @property({
    type: 'string',
  })
  profileRealName?: string;

  @property({
    type: 'string',
  })
  profileDisplayName?: string;

  @property({
    type: 'string',
  })
  profileRealNameNormalized?: string;

  @property({
    type: 'string',
  })
  profileDisplayNameNormalized?: string;

  @property({
    type: 'string',
  })
  profileEmail?: string;

  @property({
    type: 'string',
  })
  profileImage24?: string;

  @property({
    type: 'string',
  })
  profileImage32?: string;

  @property({
    type: 'string',
  })
  profileImage48?: string;

  @property({
    type: 'string',
  })
  profileImage72?: string;

  @property({
    type: 'string',
  })
  profileImage192?: string;

  @property({
    type: 'string',
  })
  profileImage512?: string;

  @property({
    type: 'string',
  })
  profileTeam?: string;

  @property({
    type: 'boolean',
    default: false,
  })
  isAdmin?: boolean;

  @property({
    type: 'boolean',
    default: false,
  })
  isOwner?: boolean;

  @property({
    type: 'boolean',
    default: false,
  })
  isPrimaryOwner?: boolean;

  @property({
    type: 'boolean',
    default: false,
  })
  isRestricted?: boolean;

  @property({
    type: 'boolean',
    default: false,
  })
  isUltraRestricted?: boolean;

  @property({
    type: 'boolean',
    default: false,
  })
  isBot?: boolean;

  @property({
    type: 'date',
    required: true,
  })
  updated: string;

  @property({
    type: 'boolean',
    default: false,
  })
  isAppUser?: boolean;

  @property({
    type: 'boolean',
    default: false,
  })
  has2fa?: boolean;

  constructor(data?: Partial<UserSlack>) {
    super(data);
  }
}

export interface UserSlackRelations {
  // describe navigational properties here
}

export type UserSlackWithRelations = UserSlack & UserSlackRelations;
