import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody
} from '@loopback/rest';
import {
  Dialog,
  DialogLineTransition
} from '../models';
import {DialogRepository} from '../repositories';

export class DialogDialogLineTransitionController {
  constructor(
    @repository(DialogRepository) protected dialogRepository: DialogRepository,
  ) { }

  @get('/api/dialogs/{id}/transitions', {
    responses: {
      '200': {
        description: 'Array of Dialog has many DialogLineTransition',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(DialogLineTransition)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<DialogLineTransition>,
  ): Promise<DialogLineTransition[]> {
    return this.dialogRepository.transitions(id).find(filter);
  }

  @post('/api/dialogs/{id}/transitions', {
    responses: {
      '200': {
        description: 'Dialog model instance',
        content: {'application/json': {schema: getModelSchemaRef(DialogLineTransition)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Dialog.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DialogLineTransition, {
            title: 'NewDialogLineTransitionInDialog',
            exclude: ['id'],
            optional: ['dialogId']
          }),
        },
      },
    }) dialogLineTransition: Omit<DialogLineTransition, 'id'>,
  ): Promise<DialogLineTransition> {
    return this.dialogRepository.transitions(id).create(dialogLineTransition);
  }

  @patch('/api/dialogs/{id}/transitions', {
    responses: {
      '200': {
        description: 'Dialog.DialogLineTransition PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DialogLineTransition, {partial: true}),
        },
      },
    })
    dialogLineTransition: Partial<DialogLineTransition>,
    @param.query.object('where', getWhereSchemaFor(DialogLineTransition)) where?: Where<DialogLineTransition>,
  ): Promise<Count> {
    return this.dialogRepository.transitions(id).patch(dialogLineTransition, where);
  }

  @del('/api/dialogs/{id}/transitions', {
    responses: {
      '200': {
        description: 'Dialog.DialogLineTransition DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(DialogLineTransition)) where?: Where<DialogLineTransition>,
  ): Promise<Count> {
    return this.dialogRepository.transitions(id).delete(where);
  }
}
