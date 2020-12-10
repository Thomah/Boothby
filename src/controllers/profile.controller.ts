// Uncomment these imports to begin using these cool features!

import {authenticate, AuthenticationBindings} from '@loopback/authentication';
import {OPERATION_SECURITY_SPEC} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, patch, requestBody} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {PasswordHasherBindings} from '../keys';
import {User, UserSlack} from '../models';
import {UserRepository} from '../repositories';
import {BcryptHasher} from '../services/hash.password';

// import {inject} from '@loopback/core';

export class ProfileController {
  constructor(
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public hasher: BcryptHasher,
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) {}

  @authenticate('jwt')
  @patch('/api/profile', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'Profile PATCH success',
      },
    },
  })
  async updateProfile(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
  ): Promise<void> {
    if (user.password) {
      user.password = await this.hasher.hashPassword(String(user.password));
    }
    await this.userRepository.updateById(currentUser.id, user);
  }

  @authenticate('jwt')
  @get('/api/profile/userslack', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Array of UserSlack of current user',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(UserSlack)},
          },
        },
      },
    },
  })
  async getUserSlack(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
  ): Promise<UserSlack[]> {
    return this.userRepository.usersSlack(currentUser.id).find();
  }
}
