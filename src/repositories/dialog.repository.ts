import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Dialog, DialogLine, DialogRelations, DialogLineTransition} from '../models';
import {DialogLineRepository} from './dialog-line.repository';
import {DialogLineTransitionRepository} from './dialog-line-transition.repository';

export class DialogRepository extends DefaultCrudRepository<
  Dialog,
  typeof Dialog.prototype.id,
  DialogRelations
> {
  public readonly dialogLines: HasManyRepositoryFactory<
    DialogLine,
    typeof Dialog.prototype.id
  >;

  public readonly transitions: HasManyRepositoryFactory<DialogLineTransition, typeof Dialog.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('DialogLineRepository')
    protected dialogLineRepositoryGetter: Getter<DialogLineRepository>, @repository.getter('DialogLineTransitionRepository') protected dialogLineTransitionRepositoryGetter: Getter<DialogLineTransitionRepository>,
  ) {
    super(Dialog, dataSource);
    this.transitions = this.createHasManyRepositoryFactoryFor('transitions', dialogLineTransitionRepositoryGetter,);
    this.dialogLines = this.createHasManyRepositoryFactoryFor(
      'lines',
      dialogLineRepositoryGetter,
    );
  }
}
