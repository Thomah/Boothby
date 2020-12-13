import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
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
import {DialogLine} from '../models';
import {DialogLineRepository} from '../repositories';

export class DialogLineController {
  constructor(
    @repository(DialogLineRepository)
    public dialogLineRepository: DialogLineRepository,
  ) {}

  @authenticate('jwt')
  @authorize({allowedRoles: ['ADMIN']})
  @post('/api/dialogs/lines', {
    responses: {
      '200': {
        description: 'DialogLine model instance',
        content: {'application/json': {schema: getModelSchemaRef(DialogLine)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DialogLine, {
            title: 'NewDialogLine',
            exclude: ['id'],
          }),
        },
      },
    })
    dialogLine: Omit<DialogLine, 'id'>,
  ): Promise<DialogLine> {
    return this.dialogLineRepository.create(dialogLine);
  }

  @authenticate('jwt')
  @authorize({allowedRoles: ['ADMIN']})
  @get('/api/dialogs/lines/count', {
    responses: {
      '200': {
        description: 'DialogLine model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(DialogLine) where?: Where<DialogLine>,
  ): Promise<Count> {
    return this.dialogLineRepository.count(where);
  }

  @authenticate('jwt')
  @authorize({allowedRoles: ['ADMIN']})
  @get('/api/dialogs/lines', {
    responses: {
      '200': {
        description: 'Array of DialogLine model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(DialogLine, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(DialogLine) filter?: Filter<DialogLine>,
  ): Promise<DialogLine[]> {
    return this.dialogLineRepository.find(filter);
  }

  @authenticate('jwt')
  @authorize({allowedRoles: ['ADMIN']})
  @patch('/api/dialogs/lines', {
    responses: {
      '200': {
        description: 'DialogLine PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DialogLine, {partial: true}),
        },
      },
    })
    dialogLine: DialogLine,
    @param.where(DialogLine) where?: Where<DialogLine>,
  ): Promise<Count> {
    return this.dialogLineRepository.updateAll(dialogLine, where);
  }

  @authenticate('jwt')
  @authorize({allowedRoles: ['ADMIN']})
  @get('/api/dialogs/lines/{id}', {
    responses: {
      '200': {
        description: 'DialogLine model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(DialogLine, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(DialogLine, {exclude: 'where'})
    filter?: FilterExcludingWhere<DialogLine>,
  ): Promise<DialogLine> {
    return this.dialogLineRepository.findById(id, filter);
  }

  @authenticate('jwt')
  @authorize({allowedRoles: ['ADMIN']})
  @patch('/api/dialogs/lines/{id}', {
    responses: {
      '204': {
        description: 'DialogLine PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DialogLine, {partial: true}),
        },
      },
    })
    dialogLine: DialogLine,
  ): Promise<void> {
    await this.dialogLineRepository.updateById(id, dialogLine);
  }

  @authenticate('jwt')
  @authorize({allowedRoles: ['ADMIN']})
  @put('/api/dialogs/lines/{id}', {
    responses: {
      '204': {
        description: 'DialogLine PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() dialogLine: DialogLine,
  ): Promise<void> {
    await this.dialogLineRepository.replaceById(id, dialogLine);
  }

  @authenticate('jwt')
  @authorize({allowedRoles: ['ADMIN']})
  @del('/api/dialogs/lines/{id}', {
    responses: {
      '204': {
        description: 'DialogLine DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.dialogLineRepository.deleteById(id);
  }
}
