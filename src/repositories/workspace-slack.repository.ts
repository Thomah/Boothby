import {DefaultCrudRepository} from '@loopback/repository';
import {WorkspaceSlack, WorkspaceSlackRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class WorkspaceSlackRepository extends DefaultCrudRepository<
  WorkspaceSlack,
  typeof WorkspaceSlack.prototype.id,
  WorkspaceSlackRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(WorkspaceSlack, dataSource);
  }
}
