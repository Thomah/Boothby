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
import {DialogLine} from '../models';
import {DialogLineRepository} from '../repositories';

export class DialogLineDialogLineController {
  constructor(
    @repository(DialogLineRepository)
    protected dialogLineRepository: DialogLineRepository,
  ) {}

  @get('/api/dialogs/lines/{id}/next', {
    responses: {
      '200': {
        description:
          'Array of DialogLine has many DialogLine through DialogLineTransition',
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
    return this.dialogLineRepository.next(id).find(filter);
  }

  @post('/api/dialogs/lines/{id}/next', {
    responses: {
      '200': {
        description: 'create a DialogLine model instance',
        content: {'application/json': {schema: getModelSchemaRef(DialogLine)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof DialogLine.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DialogLine, {
            title: 'NewDialogLineInDialogLine',
            exclude: ['id'],
          }),
        },
      },
    })
    dialogLine: Omit<DialogLine, 'id'>,
  ): Promise<DialogLine> {
    return this.dialogLineRepository.next(id).create(dialogLine);
  }

  @patch('/api/dialogs/lines/{id}/next', {
    responses: {
      '200': {
        description: 'DialogLine.DialogLine PATCH success count',
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
    return this.dialogLineRepository.next(id).patch(dialogLine, where);
  }

  @del('/api/dialogs/lines/{id}/next', {
    responses: {
      '200': {
        description: 'DialogLine.DialogLine DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(DialogLine))
    where?: Where<DialogLine>,
  ): Promise<Count> {
    return this.dialogLineRepository.next(id).delete(where);
  }
}
