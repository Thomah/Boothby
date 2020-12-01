import {belongsTo, Entity, model, property} from '@loopback/repository';
import {WorkspaceSlack} from './workspace-slack.model';
import {User} from './user.model';

@model()
export class UserSlack extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  slackId: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  accessToken: string;

  @property({
    type: 'string',
    required: true,
  })
  scope: string;

  @property({
    type: 'string',
  })
  email?: string;

  @property({
    type: 'string',
  })
  image24?: string;

  @property({
    type: 'string',
  })
  image32?: string;

  @property({
    type: 'string',
  })
  image48?: string;

  @property({
    type: 'string',
  })
  image72?: string;

  @property({
    type: 'string',
  })
  image192?: string;

  @property({
    type: 'string',
  })
  image512?: string;

  @belongsTo(() => WorkspaceSlack)
  workspaceId: number;

  @belongsTo(() => User)
  userId: number;

  constructor(data?: Partial<UserSlack>) {
    super(data);
  }
}

export interface UserSlackRelations {
  // describe navigational properties here
}

export type UserSlackWithRelations = UserSlack & UserSlackRelations;
