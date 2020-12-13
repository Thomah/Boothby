import {DefaultCrudRepository} from '@loopback/repository';
import {DialogLineTransition, DialogLineTransitionRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class DialogLineTransitionRepository extends DefaultCrudRepository<
  DialogLineTransition,
  typeof DialogLineTransition.prototype.id,
  DialogLineTransitionRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(DialogLineTransition, dataSource);
  }
}
