import {Entity, model, property} from '@loopback/repository';

@model()
export class Dialog extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'number',
  })
  ordering?: number;

  constructor(data?: Partial<Dialog>) {
    super(data);
  }
}

export interface DialogRelations {
  // describe navigational properties here
}

export type DialogWithRelations = Dialog & DialogRelations;
