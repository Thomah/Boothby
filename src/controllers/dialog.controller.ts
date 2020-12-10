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
import {Dialog} from '../models';
import {DialogRepository} from '../repositories';

export class DialogController {
  constructor(
    @repository(DialogRepository)
    public dialogRepository: DialogRepository,
  ) {}

  @authenticate('jwt')
  @authorize({allowedRoles: ['ADMIN']})
  @post('/api/dialogs', {
    responses: {
      '200': {
        description: 'Dialog model instance',
        content: {'application/json': {schema: getModelSchemaRef(Dialog)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Dialog, {
            title: 'NewDialog',
            exclude: ['id'],
          }),
        },
      },
    })
    dialog: Omit<Dialog, 'id'>,
  ): Promise<Dialog> {
    return this.dialogRepository.create(dialog);
  }

  @authenticate('jwt')
  @authorize({allowedRoles: ['ADMIN']})
  @get('/api/dialogs/count', {
    responses: {
      '200': {
        description: 'Dialog model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(@param.where(Dialog) where?: Where<Dialog>): Promise<Count> {
    return this.dialogRepository.count(where);
  }

  @authenticate('jwt')
  @authorize({allowedRoles: ['ADMIN']})
  @get('/api/dialogs', {
    responses: {
      '200': {
        description: 'Array of Dialog model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Dialog, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(@param.filter(Dialog) filter?: Filter<Dialog>): Promise<Dialog[]> {
    return this.dialogRepository.find(filter);
  }

  @authenticate('jwt')
  @authorize({allowedRoles: ['ADMIN']})
  @patch('/api/dialogs', {
    responses: {
      '200': {
        description: 'Dialog PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Dialog, {partial: true}),
        },
      },
    })
    dialog: Dialog,
    @param.where(Dialog) where?: Where<Dialog>,
  ): Promise<Count> {
    return this.dialogRepository.updateAll(dialog, where);
  }

  @authenticate('jwt')
  @authorize({allowedRoles: ['ADMIN']})
  @get('/api/dialogs/{id}', {
    responses: {
      '200': {
        description: 'Dialog model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Dialog, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Dialog, {exclude: 'where'})
    filter?: FilterExcludingWhere<Dialog>,
  ): Promise<Dialog> {
    return this.dialogRepository.findById(id, filter);
  }

  @authenticate('jwt')
  @authorize({allowedRoles: ['ADMIN']})
  @patch('/api/dialogs/{id}', {
    responses: {
      '204': {
        description: 'Dialog PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Dialog, {partial: true}),
        },
      },
    })
    dialog: Dialog,
  ): Promise<void> {
    await this.dialogRepository.updateById(id, dialog);
  }

  @authenticate('jwt')
  @authorize({allowedRoles: ['ADMIN']})
  @put('/api/dialogs/{id}', {
    responses: {
      '204': {
        description: 'Dialog PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() dialog: Dialog,
  ): Promise<void> {
    await this.dialogRepository.replaceById(id, dialog);
  }

  @authenticate('jwt')
  @authorize({allowedRoles: ['ADMIN']})
  @del('/api/dialogs/{id}', {
    responses: {
      '204': {
        description: 'Dialog DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.dialogRepository.deleteById(id);
  }
}
