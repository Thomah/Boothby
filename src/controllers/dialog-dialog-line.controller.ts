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
import {Dialog, DialogLine} from '../models';
import {DialogRepository} from '../repositories';

export class DialogDialogLineController {
  constructor(
    @repository(DialogRepository) protected dialogRepository: DialogRepository,
  ) {}

  @authenticate('jwt')
  @authorize({allowedRoles: ['ADMIN']})
  @get('/api/dialogs/{id}/lines', {
    responses: {
      '200': {
        description: 'Array of Dialog has many DialogLine',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(DialogLine)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<DialogLine>,
  ): Promise<DialogLine[]> {
    return this.dialogRepository.dialogLines(id).find(filter);
  }

  @authenticate('jwt')
  @authorize({allowedRoles: ['ADMIN']})
  @post('/api/dialogs/{id}/lines', {
    responses: {
      '200': {
        description: 'Dialog model instance',
        content: {'application/json': {schema: getModelSchemaRef(DialogLine)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Dialog.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DialogLine, {
            title: 'NewDialogLineInDialog',
            exclude: ['id'],
            optional: ['dialogId'],
          }),
        },
      },
    })
    dialogLine: Omit<DialogLine, 'id'>,
  ): Promise<DialogLine> {
    return this.dialogRepository.dialogLines(id).create(dialogLine);
  }

  @authenticate('jwt')
  @authorize({allowedRoles: ['ADMIN']})
  @patch('/api/dialogs/{id}/lines', {
    responses: {
      '200': {
        description: 'Dialog.DialogLine PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DialogLine, {partial: true}),
        },
      },
    })
    dialogLine: Partial<DialogLine>,
    @param.query.object('where', getWhereSchemaFor(DialogLine))
    where?: Where<DialogLine>,
  ): Promise<Count> {
    return this.dialogRepository.dialogLines(id).patch(dialogLine, where);
  }

  @authenticate('jwt')
  @authorize({allowedRoles: ['ADMIN']})
  @del('/api/dialogs/{id}/lines', {
    responses: {
      '200': {
        description: 'Dialog.DialogLine DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(DialogLine))
    where?: Where<DialogLine>,
  ): Promise<Count> {
    return this.dialogRepository.dialogLines(id).delete(where);
  }
}
