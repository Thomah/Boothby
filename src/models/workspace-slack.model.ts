import {Entity, model, property} from '@loopback/repository';
import {WebAPICallResult} from '@slack/web-api/dist/WebClient';

@model()
export class WorkspaceSlack extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  slackId?: string;

  @property({
    type: 'string',
  })
  name?: string;

  @property({
    type: 'string',
  })
  domain?: string;

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
  incomingWebhookChannel?: string;

  @property({
    type: 'string',
  })
  incomingWebhookChannelId?: string;

  @property({
    type: 'string',
  })
  incomingWebhookConfigurationUrl?: string;

  @property({
    type: 'string',
  })
  incomingWebhookUrl?: string;

  @property({
    type: 'string',
  })
  image34?: string;

  @property({
    type: 'string',
  })
  image44?: string;

  @property({
    type: 'string',
  })
  image68?: string;

  @property({
    type: 'string',
  })
  image88?: string;

  @property({
    type: 'string',
  })
  image102?: string;

  @property({
    type: 'string',
  })
  image132?: string;

  @property({
    type: 'string',
  })
  image230?: string;

  @property({
    type: 'string',
  })
  imageOriginale?: string;

  constructor(data?: Partial<WorkspaceSlack>) {
    super(data);
  }

  static fromSlack(raw: WebAPICallResult): WorkspaceSlack {
    const workspace = new WorkspaceSlack();
    if (raw !== undefined) {
      workspace.appId = String(raw.app_id);
      workspace.scope = String(raw.scope);
      workspace.tokenType = String(raw.token_type);
      workspace.accessToken = String(raw.access_token);
      workspace.botUserId = String(raw.bot_user_id);

      if (raw.authed_user) {
        workspace.authedUserId = String(Object(raw.authed_user).id);
      }

      if (raw.team !== null) {
        const team = Object(raw.team);
        workspace.slackId = String(team.id);
        workspace.name = String(team.name);
      }

      if (raw.incoming_webhook !== null) {
        const incomingWebhook = Object(raw.incoming_webhook);
        workspace.incomingWebhookChannel = String(incomingWebhook.channel);
        workspace.incomingWebhookChannelId = String(incomingWebhook.channel_id);
        workspace.incomingWebhookConfigurationUrl = String(
          incomingWebhook.configuration_url,
        );
        workspace.incomingWebhookUrl = String(incomingWebhook.url);
      }

      if (raw.enterprise !== null) {
        const enterprise = Object(raw.enterprise);
        workspace.enterpriseId = String(enterprise.id);
        workspace.enterpriseName = String(enterprise.name);
      }
    }
    return workspace;
  }
}

export interface WorkspaceSlackRelations {
  // describe navigational properties here
}

export type WorkspaceSlackWithRelations = WorkspaceSlack &
  WorkspaceSlackRelations;
