import type { Schema, Attribute } from '@strapi/strapi';

export interface AdminPermission extends Schema.CollectionType {
  collectionName: 'admin_permissions';
  info: {
    name: 'Permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    actionParameters: Attribute.JSON & Attribute.DefaultTo<{}>;
    subject: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    properties: Attribute.JSON & Attribute.DefaultTo<{}>;
    conditions: Attribute.JSON & Attribute.DefaultTo<[]>;
    role: Attribute.Relation<'admin::permission', 'manyToOne', 'admin::role'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminUser extends Schema.CollectionType {
  collectionName: 'admin_users';
  info: {
    name: 'User';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    firstname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    username: Attribute.String;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.Private &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: Attribute.String & Attribute.Private;
    registrationToken: Attribute.String & Attribute.Private;
    isActive: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
    roles: Attribute.Relation<'admin::user', 'manyToMany', 'admin::role'> &
      Attribute.Private;
    blocked: Attribute.Boolean & Attribute.Private & Attribute.DefaultTo<false>;
    preferedLanguage: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface AdminRole extends Schema.CollectionType {
  collectionName: 'admin_roles';
  info: {
    name: 'Role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    code: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String;
    users: Attribute.Relation<'admin::role', 'manyToMany', 'admin::user'>;
    permissions: Attribute.Relation<
      'admin::role',
      'oneToMany',
      'admin::permission'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface AdminApiToken extends Schema.CollectionType {
  collectionName: 'strapi_api_tokens';
  info: {
    name: 'Api Token';
    singularName: 'api-token';
    pluralName: 'api-tokens';
    displayName: 'Api Token';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    type: Attribute.Enumeration<['read-only', 'full-access', 'custom']> &
      Attribute.Required &
      Attribute.DefaultTo<'read-only'>;
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: Attribute.DateTime;
    permissions: Attribute.Relation<
      'admin::api-token',
      'oneToMany',
      'admin::api-token-permission'
    >;
    expiresAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminApiTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_api_token_permissions';
  info: {
    name: 'API Token Permission';
    description: '';
    singularName: 'api-token-permission';
    pluralName: 'api-token-permissions';
    displayName: 'API Token Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    token: Attribute.Relation<
      'admin::api-token-permission',
      'manyToOne',
      'admin::api-token'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminTransferToken extends Schema.CollectionType {
  collectionName: 'strapi_transfer_tokens';
  info: {
    name: 'Transfer Token';
    singularName: 'transfer-token';
    pluralName: 'transfer-tokens';
    displayName: 'Transfer Token';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: Attribute.DateTime;
    permissions: Attribute.Relation<
      'admin::transfer-token',
      'oneToMany',
      'admin::transfer-token-permission'
    >;
    expiresAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminTransferTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_transfer_token_permissions';
  info: {
    name: 'Transfer Token Permission';
    description: '';
    singularName: 'transfer-token-permission';
    pluralName: 'transfer-token-permissions';
    displayName: 'Transfer Token Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    token: Attribute.Relation<
      'admin::transfer-token-permission',
      'manyToOne',
      'admin::transfer-token'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFile extends Schema.CollectionType {
  collectionName: 'files';
  info: {
    singularName: 'file';
    pluralName: 'files';
    displayName: 'File';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    alternativeText: Attribute.String;
    caption: Attribute.String;
    width: Attribute.Integer;
    height: Attribute.Integer;
    formats: Attribute.JSON;
    hash: Attribute.String & Attribute.Required;
    ext: Attribute.String;
    mime: Attribute.String & Attribute.Required;
    size: Attribute.Decimal & Attribute.Required;
    url: Attribute.String & Attribute.Required;
    previewUrl: Attribute.String;
    provider: Attribute.String & Attribute.Required;
    provider_metadata: Attribute.JSON;
    related: Attribute.Relation<'plugin::upload.file', 'morphToMany'>;
    folder: Attribute.Relation<
      'plugin::upload.file',
      'manyToOne',
      'plugin::upload.folder'
    > &
      Attribute.Private;
    folderPath: Attribute.String &
      Attribute.Required &
      Attribute.Private &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFolder extends Schema.CollectionType {
  collectionName: 'upload_folders';
  info: {
    singularName: 'folder';
    pluralName: 'folders';
    displayName: 'Folder';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    pathId: Attribute.Integer & Attribute.Required & Attribute.Unique;
    parent: Attribute.Relation<
      'plugin::upload.folder',
      'manyToOne',
      'plugin::upload.folder'
    >;
    children: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.folder'
    >;
    files: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.file'
    >;
    path: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginContentReleasesRelease extends Schema.CollectionType {
  collectionName: 'strapi_releases';
  info: {
    singularName: 'release';
    pluralName: 'releases';
    displayName: 'Release';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    releasedAt: Attribute.DateTime;
    scheduledAt: Attribute.DateTime;
    timezone: Attribute.String;
    status: Attribute.Enumeration<
      ['ready', 'blocked', 'failed', 'done', 'empty']
    > &
      Attribute.Required;
    actions: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToMany',
      'plugin::content-releases.release-action'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginContentReleasesReleaseAction
  extends Schema.CollectionType {
  collectionName: 'strapi_release_actions';
  info: {
    singularName: 'release-action';
    pluralName: 'release-actions';
    displayName: 'Release Action';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    type: Attribute.Enumeration<['publish', 'unpublish']> & Attribute.Required;
    entry: Attribute.Relation<
      'plugin::content-releases.release-action',
      'morphToOne'
    >;
    contentType: Attribute.String & Attribute.Required;
    locale: Attribute.String;
    release: Attribute.Relation<
      'plugin::content-releases.release-action',
      'manyToOne',
      'plugin::content-releases.release'
    >;
    isEntryValid: Attribute.Boolean;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::content-releases.release-action',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::content-releases.release-action',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsPermission
  extends Schema.CollectionType {
  collectionName: 'up_permissions';
  info: {
    name: 'permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String & Attribute.Required;
    role: Attribute.Relation<
      'plugin::users-permissions.permission',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsRole extends Schema.CollectionType {
  collectionName: 'up_roles';
  info: {
    name: 'role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    description: Attribute.String;
    type: Attribute.String & Attribute.Unique;
    permissions: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.permission'
    >;
    users: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.user'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsUser extends Schema.CollectionType {
  collectionName: 'up_users';
  info: {
    name: 'user';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    username: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    provider: Attribute.String;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: Attribute.String & Attribute.Private;
    confirmationToken: Attribute.String & Attribute.Private;
    confirmed: Attribute.Boolean & Attribute.DefaultTo<false>;
    blocked: Attribute.Boolean & Attribute.DefaultTo<false>;
    role: Attribute.Relation<
      'plugin::users-permissions.user',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    phone: Attribute.String;
    cabinetName: Attribute.String;
    siretNumber: Attribute.BigInteger;
    location: Attribute.Component<'shared.address', true>;
    patients: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToMany',
      'api::patient.patient'
    >;
    offre: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'api::offre.offre'
    >;
    commandes: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToMany',
      'api::commande.commande'
    >;
    gouttiere_de_bruxismes: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToMany',
      'api::gouttiere-de-bruxisme.gouttiere-de-bruxisme'
    >;
    guide_a_etages: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToMany',
      'api::guide-a-etage.guide-a-etage'
    >;
    guide_classiques: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToMany',
      'api::guide-classique.guide-classique'
    >;
    guide_pour_gingivectomies: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToMany',
      'api::guide-pour-gingivectomie.guide-pour-gingivectomie'
    >;
    autres_services_de_conceptions: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToMany',
      'api::autres-services-de-conception.autres-services-de-conception'
    >;
    rapport_radiologiques: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToMany',
      'api::rapport-radiologique.rapport-radiologique'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginI18NLocale extends Schema.CollectionType {
  collectionName: 'i18n_locale';
  info: {
    singularName: 'locale';
    pluralName: 'locales';
    collectionName: 'locales';
    displayName: 'Locale';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.SetMinMax<
        {
          min: 1;
          max: 50;
        },
        number
      >;
    code: Attribute.String & Attribute.Unique;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiAutresServicesDeConceptionAutresServicesDeConception
  extends Schema.CollectionType {
  collectionName: 'autres_services_de_conceptions';
  info: {
    singularName: 'autres-services-de-conception';
    pluralName: 'autres-services-de-conceptions';
    displayName: 'Autres services de conception';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    comment: Attribute.String;
    service: Attribute.Relation<
      'api::autres-services-de-conception.autres-services-de-conception',
      'manyToOne',
      'api::service.service'
    >;
    service_impression_et_expedition: Attribute.Boolean;
    patient: Attribute.String;
    numero_cas: Attribute.BigInteger;
    archive: Attribute.Boolean;
    En_attente_approbation: Attribute.Boolean;
    en__cours_de_modification: Attribute.Boolean;
    soumis: Attribute.Boolean;
    approuve: Attribute.Boolean;
    produire_expide: Attribute.Boolean;
    user: Attribute.Relation<
      'api::autres-services-de-conception.autres-services-de-conception',
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    Demande_devis: Attribute.Boolean;
    pdfFile: Attribute.Media<'files'>;
    model3d: Attribute.Media<'files'>;
    cout: Attribute.Float;
    offre: Attribute.Text;
    delivery_number: Attribute.BigInteger & Attribute.DefaultTo<'0'>;
    piece_physique_cout: Attribute.Float & Attribute.DefaultTo<0>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::autres-services-de-conception.autres-services-de-conception',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::autres-services-de-conception.autres-services-de-conception',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiCommandeCommande extends Schema.CollectionType {
  collectionName: 'commandes';
  info: {
    singularName: 'commande';
    pluralName: 'commandes';
    displayName: 'commande';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    services: Attribute.Relation<
      'api::commande.commande',
      'manyToMany',
      'api::service.service'
    >;
    cost: Attribute.BigInteger;
    StripeID: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::commande.commande',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::commande.commande',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiDemandeDeModificationDemandeDeModification
  extends Schema.CollectionType {
  collectionName: 'demande_de_modifications';
  info: {
    singularName: 'demande-de-modification';
    pluralName: 'demande-de-modifications';
    displayName: 'demande de modification';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    patient: Attribute.String;
    caseNumber: Attribute.BigInteger;
    comment: Attribute.String;
    type_travail: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::demande-de-modification.demande-de-modification',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::demande-de-modification.demande-de-modification',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiDemandeProduireEtExpideGuideEtageDemandeProduireEtExpideGuideEtage
  extends Schema.CollectionType {
  collectionName: 'demande_produire_et_expide_guide_etages';
  info: {
    singularName: 'demande-produire-et-expide-guide-etage';
    pluralName: 'demande-produire-et-expide-guide-etages';
    displayName: 'Demande produire et expid\u00E9-Guide Etage';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    Patient: Attribute.String;
    case_number: Attribute.String;
    type_travail: Attribute.String;
    Immediate_Loading: Attribute.Boolean;
    Resin_Impression_of_Both_Stages: Attribute.Boolean;
    Metal_Impression_First_Stage: Attribute.Boolean;
    Metal_Impression_of_Both_Stages: Attribute.Boolean;
    Cost: Attribute.BigInteger;
    originalCost: Attribute.Float;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::demande-produire-et-expide-guide-etage.demande-produire-et-expide-guide-etage',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::demande-produire-et-expide-guide-etage.demande-produire-et-expide-guide-etage',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiDemandeProduireEtExpideeDemandeProduireEtExpidee
  extends Schema.CollectionType {
  collectionName: 'demande_produire_et_expidees';
  info: {
    singularName: 'demande-produire-et-expidee';
    pluralName: 'demande-produire-et-expidees';
    displayName: 'demande produire et expid\u00E9e';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    caseNumber: Attribute.BigInteger;
    type_travail: Attribute.String;
    cost: Attribute.BigInteger;
    patient: Attribute.String;
    originalCost: Attribute.Float;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::demande-produire-et-expidee.demande-produire-et-expidee',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::demande-produire-et-expidee.demande-produire-et-expidee',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiGouttiereDeBruxismeGouttiereDeBruxisme
  extends Schema.CollectionType {
  collectionName: 'gouttiere_de_bruxismes';
  info: {
    singularName: 'gouttiere-de-bruxisme';
    pluralName: 'gouttiere-de-bruxismes';
    displayName: 'Goutti\u00E8re de bruxisme';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    options_generiques: Attribute.Component<
      'shared.les-options-generiques-ci-dessous',
      true
    >;
    comment: Attribute.String;
    cout: Attribute.Float;
    service: Attribute.Relation<
      'api::gouttiere-de-bruxisme.gouttiere-de-bruxisme',
      'manyToOne',
      'api::service.service'
    >;
    numero_cas: Attribute.BigInteger;
    patient: Attribute.String;
    archive: Attribute.Boolean;
    En_attente_approbation: Attribute.Boolean;
    en__cours_de_modification: Attribute.Boolean;
    soumis: Attribute.Boolean;
    approuve: Attribute.Boolean;
    produire_expide: Attribute.Boolean;
    selected_teeth: Attribute.JSON;
    pdfFile: Attribute.Media<'files'>;
    model3d: Attribute.Media<'files'>;
    user: Attribute.Relation<
      'api::gouttiere-de-bruxisme.gouttiere-de-bruxisme',
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    offre: Attribute.Text;
    delivery_number: Attribute.BigInteger & Attribute.DefaultTo<'0'>;
    originalCost: Attribute.Float;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::gouttiere-de-bruxisme.gouttiere-de-bruxisme',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::gouttiere-de-bruxisme.gouttiere-de-bruxisme',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiGuideAEtageGuideAEtage extends Schema.CollectionType {
  collectionName: 'guide_a_etages';
  info: {
    singularName: 'guide-a-etage';
    pluralName: 'guide-a-etages';
    displayName: 'guide a etage';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    service: Attribute.Relation<
      'api::guide-a-etage.guide-a-etage',
      'manyToOne',
      'api::service.service'
    >;
    Options_supplementaires: Attribute.Component<'shared.option', true>;
    comment: Attribute.String;
    options_generiques: Attribute.Component<'shared.option', true>;
    Full_guidee: Attribute.Component<'shared.full-guidee', true>;
    Forage_pilote: Attribute.Component<'shared.forage-pilote', true>;
    Marque_de_la_clavette: Attribute.Component<
      'shared.marque-de-la-clavette',
      true
    >;
    Marque_de_la_trousse: Attribute.Component<
      'shared.marque-de-la-trousse-de-chirugie-utilisee',
      true
    >;
    marque_implant_pour_la_dent: Attribute.JSON;
    numero_cas: Attribute.BigInteger;
    patient: Attribute.String;
    archive: Attribute.Boolean;
    En_attente_approbation: Attribute.Boolean;
    en__cours_de_modification: Attribute.Boolean;
    soumis: Attribute.Boolean;
    approuve: Attribute.Boolean;
    produire_expide: Attribute.Boolean;
    pdfFile: Attribute.Media<'files'>;
    model3d: Attribute.Media<'files'>;
    user: Attribute.Relation<
      'api::guide-a-etage.guide-a-etage',
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    offre: Attribute.Text;
    cout: Attribute.Float;
    delivery_number: Attribute.BigInteger & Attribute.DefaultTo<'0'>;
    originalCost: Attribute.Float;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::guide-a-etage.guide-a-etage',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::guide-a-etage.guide-a-etage',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiGuideClassiqueGuideClassique extends Schema.CollectionType {
  collectionName: 'guide_classiques';
  info: {
    singularName: 'guide-classique';
    pluralName: 'guide-classiques';
    displayName: 'Guide classique';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    service: Attribute.Relation<
      'api::guide-classique.guide-classique',
      'manyToOne',
      'api::service.service'
    >;
    Full_guidee: Attribute.Component<'shared.full-guidee', true>;
    Forage_pilote: Attribute.Component<'shared.forage-pilote', true>;
    Marque_de_la_trousse: Attribute.Component<
      'shared.marque-de-la-trousse-de-chirugie-utilisee',
      true
    >;
    options_generiques: Attribute.Component<'shared.options-generiques', true>;
    Clavettes_de_stabilisation: Attribute.Component<
      'shared.clavettes-de-stabilisation',
      true
    >;
    comment: Attribute.String;
    marque_implant_pour_la_dent: Attribute.JSON;
    patient: Attribute.String;
    numero_cas: Attribute.BigInteger;
    archive: Attribute.Boolean;
    En_attente_approbation: Attribute.Boolean;
    en__cours_de_modification: Attribute.Boolean;
    soumis: Attribute.Boolean;
    approuve: Attribute.Boolean;
    produire_expide: Attribute.Boolean;
    pdfFile: Attribute.Media<'files'>;
    model3d: Attribute.Media<'files'>;
    user: Attribute.Relation<
      'api::guide-classique.guide-classique',
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    offre: Attribute.Text;
    cout: Attribute.Float;
    delivery_number: Attribute.BigInteger & Attribute.DefaultTo<'0'>;
    originalCost: Attribute.Float;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::guide-classique.guide-classique',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::guide-classique.guide-classique',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiGuidePourGingivectomieGuidePourGingivectomie
  extends Schema.CollectionType {
  collectionName: 'guide_pour_gingivectomies';
  info: {
    singularName: 'guide-pour-gingivectomie';
    pluralName: 'guide-pour-gingivectomies';
    displayName: 'Guide pour gingivectomie';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    service: Attribute.Relation<
      'api::guide-pour-gingivectomie.guide-pour-gingivectomie',
      'manyToOne',
      'api::service.service'
    >;
    options_generiques: Attribute.Component<'shared.options-generiques', true>;
    DICOM: Attribute.Component<'shared.dicom', true>;
    comment: Attribute.String;
    cout: Attribute.Float;
    patient: Attribute.String;
    numero_cas: Attribute.BigInteger;
    archive: Attribute.Boolean;
    En_attente_approbation: Attribute.Boolean;
    en__cours_de_modification: Attribute.Boolean;
    soumis: Attribute.Boolean;
    approuve: Attribute.Boolean;
    produire_expide: Attribute.Boolean;
    pdfFile: Attribute.Media<'files'>;
    model3d: Attribute.Media<'files'>;
    user: Attribute.Relation<
      'api::guide-pour-gingivectomie.guide-pour-gingivectomie',
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    selected_teeth: Attribute.JSON;
    offre: Attribute.Text;
    delivery_number: Attribute.BigInteger & Attribute.DefaultTo<'0'>;
    originalCost: Attribute.Float;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::guide-pour-gingivectomie.guide-pour-gingivectomie',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::guide-pour-gingivectomie.guide-pour-gingivectomie',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiOffreOffre extends Schema.CollectionType {
  collectionName: 'offres';
  info: {
    singularName: 'offre';
    pluralName: 'offres';
    displayName: 'offre';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    users_permissions_user: Attribute.Relation<
      'api::offre.offre',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    CurrentPlan: Attribute.Enumeration<
      ['Essential', 'Privilege', 'Elite', 'Premium']
    > &
      Attribute.DefaultTo<'Essential'>;
    yearCaseCount: Attribute.Integer & Attribute.DefaultTo<0>;
    accountCreationDate: Attribute.Date;
    lastEvaluationDate: Attribute.Date;
    quarterCaseCount: Attribute.Integer & Attribute.DefaultTo<0>;
    planStartDate: Attribute.Date;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::offre.offre',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::offre.offre',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiPatientPatient extends Schema.CollectionType {
  collectionName: 'patients';
  info: {
    singularName: 'patient';
    pluralName: 'patients';
    displayName: 'Patient';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    fullname: Attribute.String & Attribute.Required;
    caseNumber: Attribute.Integer;
    services: Attribute.Relation<
      'api::patient.patient',
      'oneToMany',
      'api::service.service'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::patient.patient',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::patient.patient',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiRapportRadiologiqueRapportRadiologique
  extends Schema.CollectionType {
  collectionName: 'rapport_radiologiques';
  info: {
    singularName: 'rapport-radiologique';
    pluralName: 'rapport-radiologiques';
    displayName: 'Rapport radiologique';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    service: Attribute.Relation<
      'api::rapport-radiologique.rapport-radiologique',
      'manyToOne',
      'api::service.service'
    >;
    first_comment: Attribute.String;
    date: Attribute.String;
    second_comment: Attribute.String;
    Implantation_prevue: Attribute.Boolean;
    Evaluer_implant_existant: Attribute.Boolean;
    Evaluation_de_ATM: Attribute.Boolean;
    Eliminer_une_pathologie: Attribute.Boolean;
    autres: Attribute.Boolean;
    patient: Attribute.String;
    soumis: Attribute.Boolean;
    archive: Attribute.Boolean;
    numero_cas: Attribute.BigInteger;
    pdfFile: Attribute.Media<'files'>;
    user: Attribute.Relation<
      'api::rapport-radiologique.rapport-radiologique',
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    cout: Attribute.Float;
    originalCost: Attribute.Float;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::rapport-radiologique.rapport-radiologique',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::rapport-radiologique.rapport-radiologique',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiServiceService extends Schema.CollectionType {
  collectionName: 'services';
  info: {
    singularName: 'service';
    pluralName: 'services';
    displayName: 'Service';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    title: Attribute.String &
      Attribute.Required &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    image: Attribute.Media<'images'> &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    description: Attribute.Text &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    initial_price: Attribute.Decimal &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    type: Attribute.Enumeration<
      ['Surigical guides', 'Design services', 'Radiolocal reports']
    > &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    guide_a_etages: Attribute.Relation<
      'api::service.service',
      'oneToMany',
      'api::guide-a-etage.guide-a-etage'
    >;
    guide_classiques: Attribute.Relation<
      'api::service.service',
      'oneToMany',
      'api::guide-classique.guide-classique'
    >;
    guide_pour_gingivectomies: Attribute.Relation<
      'api::service.service',
      'oneToMany',
      'api::guide-pour-gingivectomie.guide-pour-gingivectomie'
    >;
    gouttiere_de_bruxismes: Attribute.Relation<
      'api::service.service',
      'oneToMany',
      'api::gouttiere-de-bruxisme.gouttiere-de-bruxisme'
    >;
    autres_services_de_conceptions: Attribute.Relation<
      'api::service.service',
      'oneToMany',
      'api::autres-services-de-conception.autres-services-de-conception'
    >;
    rapport_radiologiques: Attribute.Relation<
      'api::service.service',
      'oneToMany',
      'api::rapport-radiologique.rapport-radiologique'
    >;
    patient: Attribute.Relation<
      'api::service.service',
      'manyToOne',
      'api::patient.patient'
    >;
    commandes: Attribute.Relation<
      'api::service.service',
      'manyToMany',
      'api::commande.commande'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::service.service',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::service.service',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    localizations: Attribute.Relation<
      'api::service.service',
      'oneToMany',
      'api::service.service'
    >;
    locale: Attribute.String;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface ContentTypes {
      'admin::permission': AdminPermission;
      'admin::user': AdminUser;
      'admin::role': AdminRole;
      'admin::api-token': AdminApiToken;
      'admin::api-token-permission': AdminApiTokenPermission;
      'admin::transfer-token': AdminTransferToken;
      'admin::transfer-token-permission': AdminTransferTokenPermission;
      'plugin::upload.file': PluginUploadFile;
      'plugin::upload.folder': PluginUploadFolder;
      'plugin::content-releases.release': PluginContentReleasesRelease;
      'plugin::content-releases.release-action': PluginContentReleasesReleaseAction;
      'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
      'plugin::users-permissions.role': PluginUsersPermissionsRole;
      'plugin::users-permissions.user': PluginUsersPermissionsUser;
      'plugin::i18n.locale': PluginI18NLocale;
      'api::autres-services-de-conception.autres-services-de-conception': ApiAutresServicesDeConceptionAutresServicesDeConception;
      'api::commande.commande': ApiCommandeCommande;
      'api::demande-de-modification.demande-de-modification': ApiDemandeDeModificationDemandeDeModification;
      'api::demande-produire-et-expide-guide-etage.demande-produire-et-expide-guide-etage': ApiDemandeProduireEtExpideGuideEtageDemandeProduireEtExpideGuideEtage;
      'api::demande-produire-et-expidee.demande-produire-et-expidee': ApiDemandeProduireEtExpideeDemandeProduireEtExpidee;
      'api::gouttiere-de-bruxisme.gouttiere-de-bruxisme': ApiGouttiereDeBruxismeGouttiereDeBruxisme;
      'api::guide-a-etage.guide-a-etage': ApiGuideAEtageGuideAEtage;
      'api::guide-classique.guide-classique': ApiGuideClassiqueGuideClassique;
      'api::guide-pour-gingivectomie.guide-pour-gingivectomie': ApiGuidePourGingivectomieGuidePourGingivectomie;
      'api::offre.offre': ApiOffreOffre;
      'api::patient.patient': ApiPatientPatient;
      'api::rapport-radiologique.rapport-radiologique': ApiRapportRadiologiqueRapportRadiologique;
      'api::service.service': ApiServiceService;
    }
  }
}
