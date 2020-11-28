import {Entity, model, property} from '@loopback/repository';

@model()
export class Identity extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;


  constructor(data?: Partial<Identity>) {
    super(data);
  }
}

export interface IdentityRelations {
  // describe navigational properties here
}

export type IdentityWithRelations = Identity & IdentityRelations;
