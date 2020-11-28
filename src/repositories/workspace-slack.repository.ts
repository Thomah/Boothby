import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {WorkspaceSlack, WorkspaceSlackRelations} from '../models';

export class WorkspaceSlackRepository extends DefaultCrudRepository<
  WorkspaceSlack,
  typeof WorkspaceSlack.prototype.id,
  WorkspaceSlackRelations
> {
  constructor(@inject('datasources.db') dataSource: DbDataSource) {
    super(WorkspaceSlack, dataSource);
  }
}
