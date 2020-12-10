import {authenticate, AuthenticationBindings} from '@loopback/authentication';
import {OPERATION_SECURITY_SPEC} from '@loopback/authentication-jwt';
import {authorize} from '@loopback/authorization';
import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  put,
  requestBody,
} from '@loopback/rest';
import {UserSecurity, WorkspaceSlack} from '../models';
import {UserSlackRepository, WorkspaceSlackRepository} from '../repositories';

export class WorkspaceSlackController {
  constructor(
    @repository(UserSlackRepository)
    public userSlackRepository: UserSlackRepository,
    @repository(WorkspaceSlackRepository)
    public workspaceSlackRepository: WorkspaceSlackRepository,
  ) {}

  @authenticate('jwt')
  @authorize({allowedRoles: ['ADMIN']})
  @post('/api/workspaces/slack', {
    responses: {
      '200': {
        description: 'WorkspaceSlack model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(WorkspaceSlack)},
        },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(WorkspaceSlack, {
            title: 'NewWorkspaceSlack',
            exclude: ['id'],
          }),
        },
      },
    })
    workspaceSlack: Omit<WorkspaceSlack, 'id'>,
  ): Promise<WorkspaceSlack> {
    return this.workspaceSlackRepository.create(workspaceSlack);
  }

  @authenticate('jwt')
  @authorize({allowedRoles: ['ADMIN']})
  @get('/api/workspaces/slack/count', {
    responses: {
      '200': {
        description: 'WorkspaceSlack model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(WorkspaceSlack) where?: Where<WorkspaceSlack>,
  ): Promise<Count> {
    return this.workspaceSlackRepository.count(where);
  }

  @authenticate('jwt')
  @authorize({allowedRoles: ['ADMIN']})
  @get('/api/workspaces/slack', {
    responses: {
      '200': {
        description: 'Array of WorkspaceSlack model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(WorkspaceSlack, {
                includeRelations: true,
              }),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(WorkspaceSlack) filter?: Filter<WorkspaceSlack>,
  ): Promise<WorkspaceSlack[]> {
    return this.workspaceSlackRepository.find(filter);
  }

  @authenticate('jwt')
  @authorize({allowedRoles: ['ADMIN']})
  @patch('/api/workspaces/slack', {
    responses: {
      '200': {
        description: 'WorkspaceSlack PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(WorkspaceSlack, {partial: true}),
        },
      },
    })
    workspaceSlack: WorkspaceSlack,
    @param.where(WorkspaceSlack) where?: Where<WorkspaceSlack>,
  ): Promise<Count> {
    return this.workspaceSlackRepository.updateAll(workspaceSlack, where);
  }

  @authenticate('jwt')
  @authorize({allowedRoles: ['MEMBER', 'ADMIN']})
  @get('/api/workspaces/slack/{id}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'WorkspaceSlack model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(WorkspaceSlack, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserSecurity,
    @param.path.number('id') id: number,
    @param.filter(WorkspaceSlack, {exclude: 'where'})
    filter?: FilterExcludingWhere<WorkspaceSlack>,
  ): Promise<WorkspaceSlack> {
    const usersSlack = await this.userSlackRepository.find({
      where: {userId: currentUser.id, workspaceId: id},
    });
    if (usersSlack.length > 0 || currentUser.role === 'ADMIN') {
      return this.workspaceSlackRepository.findById(id, filter);
    } else {
      throw new HttpErrors.NotFound();
    }
  }

  @authenticate('jwt')
  @authorize({allowedRoles: ['ADMIN']})
  @patch('/api/workspaces/slack/{id}', {
    responses: {
      '204': {
        description: 'WorkspaceSlack PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(WorkspaceSlack, {partial: true}),
        },
      },
    })
    workspaceSlack: WorkspaceSlack,
  ): Promise<void> {
    await this.workspaceSlackRepository.updateById(id, workspaceSlack);
  }

  @authenticate('jwt')
  @authorize({allowedRoles: ['ADMIN']})
  @put('/api/workspaces/slack/{id}', {
    responses: {
      '204': {
        description: 'WorkspaceSlack PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() workspaceSlack: WorkspaceSlack,
  ): Promise<void> {
    await this.workspaceSlackRepository.replaceById(id, workspaceSlack);
  }

  @authenticate('jwt')
  @authorize({allowedRoles: ['ADMIN']})
  @del('/api/workspaces/slack/{id}', {
    responses: {
      '204': {
        description: 'WorkspaceSlack DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.workspaceSlackRepository.deleteById(id);
  }
}
