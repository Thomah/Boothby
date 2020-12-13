import {
  belongsTo,
  Entity,
  hasMany,
  model,
  property,
} from '@loopback/repository';
import {DialogLineTransition} from './dialog-line-transition.model';
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

  @hasMany(() => DialogLine, {
    through: {
      model: () => DialogLineTransition,
      keyFrom: 'previous',
      keyTo: 'next',
    },
  })
  next: DialogLine[];

  constructor(data?: Partial<DialogLine>) {
    super(data);
  }
}

export interface DialogLineRelations {
  // describe navigational properties here
}

export type DialogLineWithRelations = DialogLine & DialogLineRelations;
