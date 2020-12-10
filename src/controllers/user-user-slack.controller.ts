import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {User, UserSlack} from '../models';
import {UserRepository} from '../repositories';

export class UserUserSlackController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) {}

  @authenticate('jwt')
  @authorize({allowedRoles: ['ADMIN']})
  @get('/api/users/{id}/userslack', {
    responses: {
      '200': {
        description: 'Array of User has many UserSlack',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(UserSlack)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<UserSlack>,
  ): Promise<UserSlack[]> {
    return this.userRepository.usersSlack(id).find(filter);
  }

  @authenticate('jwt')
  @authorize({allowedRoles: ['ADMIN']})
  @post('/api/users/{id}/userslack', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(UserSlack)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserSlack, {
            title: 'NewUserSlackInUser',
            exclude: ['id'],
            optional: ['userId'],
          }),
        },
      },
    })
    userSlack: Omit<UserSlack, 'id'>,
  ): Promise<UserSlack> {
    return this.userRepository.usersSlack(id).create(userSlack);
  }

  @authenticate('jwt')
  @authorize({allowedRoles: ['ADMIN']})
  @patch('/api/users/{id}/userslack', {
    responses: {
      '200': {
        description: 'User.UserSlack PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserSlack, {partial: true}),
        },
      },
    })
    userSlack: Partial<UserSlack>,
    @param.query.object('where', getWhereSchemaFor(UserSlack))
    where?: Where<UserSlack>,
  ): Promise<Count> {
    return this.userRepository.usersSlack(id).patch(userSlack, where);
  }

  @authenticate('jwt')
  @authorize({allowedRoles: ['ADMIN']})
  @del('/api/users/{id}/userslack', {
    responses: {
      '200': {
        description: 'User.UserSlack DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(UserSlack))
    where?: Where<UserSlack>,
  ): Promise<Count> {
    return this.userRepository.usersSlack(id).delete(where);
  }
}
