import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,

  HasOneRepositoryFactory, repository
} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {
  Dialog,
  DialogLine,
  DialogLineRelations,
  DialogLineTransition
} from '../models';
import {DialogLineTransitionRepository} from './dialog-line-transition.repository';
import {DialogRepository} from './dialog.repository';

export class DialogLineRepository extends DefaultCrudRepository<
  DialogLine,
  typeof DialogLine.prototype.id,
  DialogLineRelations
  > {
  public readonly dialog: BelongsToAccessor<
    Dialog,
    typeof DialogLine.prototype.id
  >;

  public readonly nextTransition: HasOneRepositoryFactory<DialogLineTransition, typeof DialogLine.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('DialogRepository')
    protected dialogRepositoryGetter: Getter<DialogRepository>,
    @repository.getter('DialogLineTransitionRepository')
    protected dialogLineTransitionRepositoryGetter: Getter<DialogLineTransitionRepository>,
    @repository.getter('DialogLineRepository')
    protected dialogLineRepositoryGetter: Getter<DialogLineRepository>,
  ) {
    super(DialogLine, dataSource);
    this.nextTransition = this.createHasOneRepositoryFactoryFor('nextTransition', dialogLineTransitionRepositoryGetter);
    this.registerInclusionResolver('nextTransition', this.nextTransition.inclusionResolver);
    this.dialog = this.createBelongsToAccessorFor(
      'dialog',
      dialogRepositoryGetter,
    );
    this.registerInclusionResolver('dialog', this.dialog.inclusionResolver);
  }
}
