import {Entity, hasMany, model, property} from '@loopback/repository';
import {DialogLineTransition} from './dialog-line-transition.model';
import {DialogLine} from './dialog-line.model';

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

  @property({
    type: 'number',
  })
  firstLine?: number;

  @hasMany(() => DialogLine)
  lines: DialogLine[];

  @hasMany(() => DialogLineTransition)
  transitions: DialogLineTransition[];

  constructor(data?: Partial<Dialog>) {
    super(data);
  }
}

export interface DialogRelations {
  // describe navigational properties here
}

export type DialogWithRelations = Dialog & DialogRelations;
