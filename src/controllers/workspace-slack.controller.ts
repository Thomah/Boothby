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
  param,
  patch,
  post,
  put,
  requestBody,
} from '@loopback/rest';
import {WorkspaceSlack} from '../models';
import {WorkspaceSlackRepository} from '../repositories';

export class WorkspaceSlackController {
  constructor(
    @repository(WorkspaceSlackRepository)
    public workspaceSlackRepository: WorkspaceSlackRepository,
  ) {}

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

  @get('/api/workspaces/slack/{id}', {
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
    @param.path.number('id') id: number,
    @param.filter(WorkspaceSlack, {exclude: 'where'})
    filter?: FilterExcludingWhere<WorkspaceSlack>,
  ): Promise<WorkspaceSlack> {
    return this.workspaceSlackRepository.findById(id, filter);
  }

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
