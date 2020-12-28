import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasOneRepositoryFactory, repository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {DialogLine, DialogLineTransition, DialogLineTransitionRelations} from '../models';
import {DialogLineRepository} from './dialog-line.repository';

export class DialogLineTransitionRepository extends DefaultCrudRepository<
  DialogLineTransition,
  typeof DialogLineTransition.prototype.id,
  DialogLineTransitionRelations
  > {

  public readonly nextLine: HasOneRepositoryFactory<DialogLine, typeof DialogLineTransition.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('DialogLineRepository') protected dialogLineRepositoryGetter: Getter<DialogLineRepository>,
  ) {
    super(DialogLineTransition, dataSource);
    this.nextLine = this.createHasOneRepositoryFactoryFor('nextLine', dialogLineRepositoryGetter);
    this.registerInclusionResolver('nextLine', this.nextLine.inclusionResolver);
  }
}
