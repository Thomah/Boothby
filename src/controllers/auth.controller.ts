/* eslint-disable @typescript-eslint/naming-convention */
import {authenticate, AuthenticationBindings} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  HttpErrors,
  post,
  requestBody,
} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {WebClient} from '@slack/web-api';
import * as _ from 'lodash';
import {
  PasswordHasherBindings,
  RandomServiceBindings,
  TokenServiceBindings,
  UserServiceBindings,
} from '../keys';
import {AccessToken, User, UserSlack} from '../models';
import {
  Credentials,
  UserRepository,
  UserSlackRepository,
  WorkspaceSlackRepository,
} from '../repositories';
import {RandomService, validateCredentials} from '../services';
import {BcryptHasher} from '../services/hash.password';
import {JWTService} from '../services/jwt.service';
import {MyUserService} from '../services/user.service';
import {OPERATION_SECURITY_SPEC} from '../utils/security-spec';

export type OAuthRequest = {
  code: string;
  redirectUri: string;
};

export class AuthController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,

    @repository(UserSlackRepository)
    public userSlackRepository: UserSlackRepository,

    @repository(WorkspaceSlackRepository)
    public workspaceSlackRepository: WorkspaceSlackRepository,

    // @inject('service.hasher')
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public hasher: BcryptHasher,

    // @inject('service.user.service')
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,

    // @inject('service.jwt.service')
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: JWTService,

    @inject(RandomServiceBindings.RANDOM_SERVICE)
    public randomService: RandomService,
  ) {}

  @post('/api/signup', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User, {
              title: 'NewUser',
            }),
          },
        },
      },
    },
  })
  async signup(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            exclude: ['id'],
          }),
        },
      },
    })
    userData: User,
  ) {
    validateCredentials(_.pick(userData, ['email', 'password']));
    userData.password = await this.hasher.hashPassword(
      String(userData.password),
    );
    const savedUser = await this.userRepository.create(userData);
    savedUser.password = '***';
    return savedUser;
  }

  @post('/api/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: {
                type: 'string',
              },
              password: {
                type: 'string',
              },
            },
          },
        },
      },
    })
    credentials: Credentials,
  ): Promise<{token: string}> {
    // make sure user exist,password should be valid
    const user = await this.userService.verifyCredentials(credentials);
    const userProfile = this.userService.convertToUserProfile(user);
    const token = await this.jwtService.generateToken(userProfile);
    return Promise.resolve({token: token});
  }

  @authenticate('jwt')
  @get('/api/whoami', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'The current user profile',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User, {
              title: 'CurrentUser',
            }),
          },
        },
      },
    },
  })
  async whoami(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
  ): Promise<User> {
    return this.userRepository.findById(currentUser.id);
  }

  // Map to `POST /login/slack`
  @post('/api/login/slack', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: getModelSchemaRef(AccessToken, {
              title: 'AccessToken',
            }),
          },
        },
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
  ): Promise<AccessToken> {
    let result;
    try {
      // Complete OAuth2 process
      result = await new WebClient().oauth.v2.access({
        client_id: String(process.env.SLACK_CLIENT_ID),
        client_secret: String(process.env.SLACK_CLIENT_SECRET),
        redirect_uri: body.redirectUri,
        code: body.code,
      });

      // Verify Slack response
      if (
        result === null ||
        !result.ok ||
        result.team === null ||
        result.authed_user === null
      ) {
        throw new HttpErrors.BadRequest('Provided code is incorrect');
      }

      // Retrieve corresponding workspace in DB
      result = Object(result);
      const existingWorkspace = await this.workspaceSlackRepository.find({
        where: {slackId: result.team.id},
        limit: 1,
      });

      // Verify Workspace existence
      if (existingWorkspace.length === 0) {
        throw new HttpErrors.NotFound('The workspace has not been registered');
      }

      // Retrieve corresponding Slack User in DB
      const existingUserSlack = await this.userSlackRepository.find({
        where: {slackId: result.authed_user.id},
        limit: 1,
      });

      // Build Slack User with OAuth2 response
      let userSlack;
      if (existingUserSlack.length === 0) {
        userSlack = new UserSlack();
      } else {
        userSlack = existingUserSlack[0];
      }
      userSlack.slackId = result.authed_user.id;
      userSlack.accessToken = result.authed_user.access_token;
      userSlack.scope = result.authed_user.scope;
      userSlack.workspaceId = Number(existingWorkspace[0].id);

      // Get Slack profile informations
      result = await new WebClient(userSlack.accessToken).users.identity();

      // Verify Slack response
      if (result === null || !result.ok || result.user === null) {
        throw new HttpErrors.InternalServerError(
          `Cannot get user informations of user ${userSlack.slackId}`,
        );
      }

      // Complete Slack User with profile response
      result = Object(result);
      userSlack.name = result.user.name;
      userSlack.email = result.user.email;
      userSlack.image24 = result.user.image_24;
      userSlack.image32 = result.user.image_32;
      userSlack.image48 = result.user.image_48;
      userSlack.image72 = result.user.image_72;
      userSlack.image192 = result.user.image_192;
      userSlack.image512 = result.user.image_512;

      // Retrieve corresponding User in DB
      const existingUser = await this.userRepository.find({
        where: {email: userSlack.email},
        limit: 1,
      });

      // Build User with Slack User and save in DB
      let user;
      if (existingUser.length === 0) {
        user = new User();
      } else {
        user = existingUser[0];
      }
      user.email = String(userSlack.email);
      user.avatarUrl = userSlack.image512;
      if (user.role === undefined) {
        user.role = 'MEMBER';
      }
      if (user.username === undefined) {
        user.username = user.email;
      }
      if (user.password === undefined) {
        user.password = await this.hasher.hashPassword(
          String(this.randomService.random(8)),
        );
      }
      if (user.name === undefined) {
        user.name = userSlack.name;
      }
      user = await this.userRepository.save(user);

      // Save Slack User in DB
      userSlack.userId = Number(user.id);
      await this.userSlackRepository.save(userSlack);

      // Update Slack Workspace and save in DB
      const workspace = existingWorkspace[0];
      workspace.name = result.team.name;
      workspace.domain = result.team.domain;
      workspace.image34 = result.team.image_34;
      workspace.image44 = result.team.image_44;
      workspace.image68 = result.team.image_68;
      workspace.image88 = result.team.image_88;
      workspace.image102 = result.team.image_102;
      workspace.image132 = result.team.image_132;
      workspace.image230 = result.team.image_230;
      workspace.imageOriginale = result.team.image_original;
      await this.workspaceSlackRepository.save(workspace);

      // Create token for login
      const accessToken = new AccessToken();
      const userProfile = this.userService.convertToUserProfile(user);
      const token = await this.jwtService.generateToken(userProfile);
      accessToken.token = token;
      return accessToken;
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
