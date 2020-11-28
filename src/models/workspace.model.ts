import {model} from '@loopback/repository';
import {Identity} from './identity.model';

@model()
export class Workspace extends Identity {
  constructor(data?: Partial<Workspace>) {
    super(data);
  }
}

export interface WorkspaceRelations {
  // describe navigational properties here
}

export type WorkspaceWithRelations = Workspace & WorkspaceRelations;
