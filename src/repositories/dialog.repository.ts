import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Dialog, DialogLine, DialogRelations} from '../models';
import {DialogLineRepository} from './dialog-line.repository';

export class DialogRepository extends DefaultCrudRepository<
  Dialog,
  typeof Dialog.prototype.id,
  DialogRelations
> {
  public readonly dialogLines: HasManyRepositoryFactory<
    DialogLine,
    typeof Dialog.prototype.id
  >;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('DialogLineRepository')
    protected dialogLineRepositoryGetter: Getter<DialogLineRepository>,
  ) {
    super(Dialog, dataSource);
    this.dialogLines = this.createHasManyRepositoryFactoryFor(
      'lines',
      dialogLineRepositoryGetter,
    );
  }
}
