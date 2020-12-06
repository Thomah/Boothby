/* eslint-disable @typescript-eslint/naming-convention */
const {WebClient} = require('@slack/web-api');

import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  HttpErrors,
  post,
  requestBody,
  Response,
  RestBindings,
} from '@loopback/rest';
import {WorkspaceSlack} from '../models';
import {WorkspaceSlackRepository} from '../repositories';
import {OAuthRequest} from './auth.controller';

export class InstallController {
  constructor(
    @inject(RestBindings.Http.RESPONSE) private response: Response,
    @repository(WorkspaceSlackRepository)
    public workspaceSlackRepository: WorkspaceSlackRepository,
  ) {}

  // Map to `GET /install/slack`
  @post('/api/install/slack', {
    responses: {
      '200': {
        description: 'Successful install',
      },
    },
  })
  async slack(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              code: {
                type: 'string',
              },
              redirectUri: {
                type: 'string',
              },
            },
          },
        },
      },
    })
    body: OAuthRequest,
  ): Promise<Response> {
    let result;
    try {
      result = await new WebClient().oauth.v2.access({
        client_id: String(process.env.SLACK_CLIENT_ID),
        client_secret: String(process.env.SLACK_CLIENT_SECRET),
        redirect_uri: body.redirectUri,
        code: body.code,
      });

      if (
        result === null ||
        !result.ok ||
        result.team === null ||
        result.incoming_webhook === null
      ) {
        throw new HttpErrors.BadRequest('Provided code is incorrect');
      }

      const existingWorkspace = await this.workspaceSlackRepository.find({
        where: {slackId: result.team.id},
        limit: 1,
      });
      if (existingWorkspace.length === 1) {
        throw new HttpErrors.BadRequest('Workspace is already registered');
      }

      await this.workspaceSlackRepository.save(
        WorkspaceSlack.fromSlack(result),
      );

      this.response.status(200).send();
      return this.response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
