import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param,


  patch, post,




  put,

  requestBody
} from '@loopback/rest';
import {DialogLineTransition} from '../models';
import {DialogLineTransitionRepository} from '../repositories';

export class DialogLineTransitionController {
  constructor(
    @repository(DialogLineTransitionRepository)
    public dialogLineTransitionRepository: DialogLineTransitionRepository,
  ) { }

  @post('/api/dialogs/transitions', {
    responses: {
      '200': {
        description: 'DialogLineTransition model instance',
        content: {'application/json': {schema: getModelSchemaRef(DialogLineTransition)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DialogLineTransition, {
            title: 'NewDialogLineTransition',
            exclude: ['id'],
          }),
        },
      },
    })
    dialogLineTransition: Omit<DialogLineTransition, 'id'>,
  ): Promise<DialogLineTransition> {
    return this.dialogLineTransitionRepository.create(dialogLineTransition);
  }

  @get('/api/dialogs/transitions/count', {
    responses: {
      '200': {
        description: 'DialogLineTransition model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(DialogLineTransition) where?: Where<DialogLineTransition>,
  ): Promise<Count> {
    return this.dialogLineTransitionRepository.count(where);
  }

  @get('/api/dialogs/transitions', {
    responses: {
      '200': {
        description: 'Array of DialogLineTransition model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(DialogLineTransition, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(DialogLineTransition) filter?: Filter<DialogLineTransition>,
  ): Promise<DialogLineTransition[]> {
    return this.dialogLineTransitionRepository.find(filter);
  }

  @patch('/api/dialogs/transitions', {
    responses: {
      '200': {
        description: 'DialogLineTransition PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DialogLineTransition, {partial: true}),
        },
      },
    })
    dialogLineTransition: DialogLineTransition,
    @param.where(DialogLineTransition) where?: Where<DialogLineTransition>,
  ): Promise<Count> {
    return this.dialogLineTransitionRepository.updateAll(dialogLineTransition, where);
  }

  @get('/api/dialogs/transitions/{id}', {
    responses: {
      '200': {
        description: 'DialogLineTransition model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(DialogLineTransition, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(DialogLineTransition, {exclude: 'where'}) filter?: FilterExcludingWhere<DialogLineTransition>
  ): Promise<DialogLineTransition> {
    return this.dialogLineTransitionRepository.findById(id, filter);
  }

  @patch('/api/dialogs/transitions/{id}', {
    responses: {
      '204': {
        description: 'DialogLineTransition PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DialogLineTransition, {partial: true}),
        },
      },
    })
    dialogLineTransition: DialogLineTransition,
  ): Promise<void> {
    await this.dialogLineTransitionRepository.updateById(id, dialogLineTransition);
  }

  @put('/api/dialogs/transitions/{id}', {
    responses: {
      '204': {
        description: 'DialogLineTransition PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() dialogLineTransition: DialogLineTransition,
  ): Promise<void> {
    await this.dialogLineTransitionRepository.replaceById(id, dialogLineTransition);
  }

  @del('/api/dialogs/transitions/{id}', {
    responses: {
      '204': {
        description: 'DialogLineTransition DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.dialogLineTransitionRepository.deleteById(id);
  }
}
