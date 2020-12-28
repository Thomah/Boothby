import {
  belongsTo,
  Entity,


  model,
  property
} from '@loopback/repository';
import {Dialog} from './dialog.model';

@model()
export class DialogLine extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  text?: string;

  @belongsTo(() => Dialog)
  dialogId: number;

  @property({
    type: 'number',
  })
  previousTransition?: number;

  constructor(data?: Partial<DialogLine>) {
    super(data);
  }
}

export interface DialogLineRelations {
  // describe navigational properties here
}

export type DialogLineWithRelations = DialogLine & DialogLineRelations;
