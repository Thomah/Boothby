// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/core';
import {get, param, Response, RestBindings} from '@loopback/rest';

export class InstallController {
  constructor(@inject(RestBindings.Http.RESPONSE) private response: Response) {}

  // Map to `GET /install/slack`
  @get('/api/install/slack')
  slack(@param.query.string('code') code: string): Response {
    console.log(code);

    this.response.setHeader("Location", "/");
    this.response.status(301).send();
    return this.response;
  }
}
