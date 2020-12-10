import {DefaultCrudRepository} from '@loopback/repository';
import {Dialog, DialogRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class DialogRepository extends DefaultCrudRepository<
  Dialog,
  typeof Dialog.prototype.id,
  DialogRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Dialog, dataSource);
  }
}
