import {
  AuthenticationComponent,
  registerAuthenticationStrategy,
} from '@loopback/authentication';
import {SECURITY_SCHEME_SPEC} from '@loopback/authentication-jwt';
import {
  AuthorizationComponent,
  AuthorizationDecision,
  AuthorizationOptions,
  AuthorizationTags,
} from '@loopback/authorization';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin, SchemaMigrationOptions} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import {genSalt, hash} from 'bcryptjs';
import path from 'path';
import {JWTStrategy} from './authentication-strategies/jwt-strategies';
import {
  PasswordHasherBindings,
  RandomServiceBindings,
  TokenServiceBindings,
  TokenServiceConstants,
  UserServiceBindings,
} from './keys';
import {User} from './models';
import {UserRepository} from './repositories';
import {MySequence} from './sequence';
import {RandomService} from './services';
import {BoothbyAuthorizer} from './services/authorization.provider';
import {BcryptHasher} from './services/hash.password';
import {JWTService} from './services/jwt.service';
import {MyUserService} from './services/user.service';

export {ApplicationConfig};

export class BoothbyApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // setup binding
    this.setupBinding();

    // Add security spec
    this.addSecuritySpec();

    // Add authenticatioon component
    this.component(AuthenticationComponent);
    registerAuthenticationStrategy(this, JWTStrategy);

    // Add authorization component
    const authorizeOptions: AuthorizationOptions = {
      precedence: AuthorizationDecision.DENY,
      defaultDecision: AuthorizationDecision.DENY,
    };
    const binding = this.component(AuthorizationComponent);
    this.configure(binding.key).to(authorizeOptions);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }

  async migrateSchema(options?: SchemaMigrationOptions) {
    await super.migrateSchema(options);

    // Create admin user if does not exists
    const userRepo = await this.getRepository(UserRepository);
    const found = await userRepo.findOne({where: {username: 'admin'}});
    if (!found) {
      const admin = new User({
        role: 'ADMIN',
        username: 'admin',
        email: 'admin@boothby.fr',
      });
      admin.password = await hash('admin', await genSalt());
      await userRepo.create(admin);
    }
  }

  setupBinding(): void {
    this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(BcryptHasher);
    this.bind(PasswordHasherBindings.ROUNDS).to(10);
    this.bind(UserServiceBindings.USER_SERVICE).toClass(MyUserService);
    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService);
    this.bind(TokenServiceBindings.TOKEN_SECRET).to(
      TokenServiceConstants.TOKEN_SECRET_VALUE,
    );
    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(
      TokenServiceConstants.TOKEN_EXPIRES_IN_VALUE,
    );
    this.bind(RandomServiceBindings.RANDOM_SERVICE).toClass(RandomService);

    this.bind('authorizationProviders.boothby-authorizer-provider')
      .toProvider(BoothbyAuthorizer)
      .tag(AuthorizationTags.AUTHORIZER);
  }

  addSecuritySpec(): void {
    this.api({
      openapi: '3.0.0',
      info: {
        title: 'boothby',
        version: '2.0.0',
      },
      paths: {},
      components: {securitySchemes: SECURITY_SCHEME_SPEC},
      security: [
        {
          // secure all endpoints with 'jwt'
          jwt: [],
        },
      ],
      servers: [{url: '/'}],
    });
  }
}
