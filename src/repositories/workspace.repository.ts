import {DefaultCrudRepository} from '@loopback/repository';
import {Workspace, WorkspaceRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class WorkspaceRepository extends DefaultCrudRepository<
  Workspace,
  typeof Workspace.prototype.id,
  WorkspaceRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Workspace, dataSource);
  }
}
