import {Entity, model, property} from '@loopback/repository';

@model()
export class Workspace extends Entity {
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
  type: string;

  @property({
    type: 'string',
  })
  teamId?: string;

  @property({
    type: 'string',
  })
  teamName?: string;

  @property({
    type: 'string',
  })
  enterpriseId?: string;

  @property({
    type: 'string',
  })
  enterpriseName?: string;

  @property({
    type: 'string',
  })
  appId?: string;

  @property({
    type: 'string',
  })
  botUserId?: string;

  @property({
    type: 'string',
  })
  scope?: string;

  @property({
    type: 'string',
  })
  tokenType?: string;

  @property({
    type: 'string',
  })
  accessToken?: string;

  @property({
    type: 'string',
  })
  authedUserId?: string;

  @property({
    type: 'string',
  })
  authedUserScope?: string;

  @property({
    type: 'string',
  })
  authedUserTokenType?: string;

  @property({
    type: 'string',
  })
  authedUserAccessToken?: string;


  constructor(data?: Partial<Workspace>) {
    super(data);
  }
}

export interface WorkspaceRelations {
  // describe navigational properties here
}

export type WorkspaceWithRelations = Workspace & WorkspaceRelations;
