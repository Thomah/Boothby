/* eslint-disable @typescript-eslint/naming-convention */
const {WebClient} = require('@slack/web-api');

import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get, HttpErrors, param, Response, RestBindings} from '@loopback/rest';
import {WorkspaceSlack} from '../models';
import {WorkspaceSlackRepository} from '../repositories';

export class InstallController {
  constructor(
    @inject(RestBindings.Http.RESPONSE) private response: Response,
    @repository(WorkspaceSlackRepository)
    public workspaceSlackRepository: WorkspaceSlackRepository,
  ) {}

  static SLACK_CLIENT_ID = process.env.SLACK_CLIENT_ID;
  static SLACK_CLIENT_SECRET = process.env.SLACK_CLIENT_SECRET;

  // Map to `GET /install/slack`
  @get('/api/install/slack', {
    responses: {
      '301': {
        description: 'Redirect after successful install',
      },
    },
  })
  async slack(@param.query.string('code') code: string): Promise<Response> {
    let result;
    try {
      result = await new WebClient().oauth.v2.access({
        client_id: InstallController.SLACK_CLIENT_ID,
        client_secret: InstallController.SLACK_CLIENT_SECRET,
        code,
      });

      if (
        !result.ok ||
        result.team === null ||
        result.incoming_webhook === null
      ) {
        throw new HttpErrors.BadRequest('Provided code is incorrect');
      }

      const existingWorkspace = await this.workspaceSlackRepository.find({
        where: {teamId: result.team.id},
        limit: 1,
      });
      if (existingWorkspace.length === 1) {
        throw new HttpErrors.BadRequest('Workspace is already registered');
      }

      const savedWorkspace = await this.workspaceSlackRepository.save(
        WorkspaceSlack.fromSlack(result),
      );
      console.log(savedWorkspace);

      this.response.setHeader('Location', '/');
      this.response.status(301).send();
      return this.response;
    } catch (error) {
      console.log(error);
      if (error.data !== undefined) {
        throw new HttpErrors.BadRequest(error.data.error);
      } else if (error.code !== undefined) {
        throw new HttpErrors.HttpError(error.code);
      }
      throw error;
    }
  }
}
