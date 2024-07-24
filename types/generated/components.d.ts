import type { Schema, Attribute } from '@strapi/strapi';

export interface SharedAddress extends Schema.Component {
  collectionName: 'components_shared_addresses';
  info: {
    displayName: 'Address';
    icon: 'pin';
    description: '';
  };
  attributes: {
    Address: Attribute.String;
    Office: Attribute.String;
    zipCode: Attribute.String;
    city: Attribute.String;
    department: Attribute.String;
    country: Attribute.String;
    State: Attribute.String;
  };
}

export interface SharedClavettesDeStabilisation extends Schema.Component {
  collectionName: 'components_shared_clavettes_de_stabilisations';
  info: {
    displayName: 'Clavettes de stabilisation';
    description: '';
  };
  attributes: {
    title: Attribute.String;
    active: Attribute.Boolean;
    nombre_des_clavettes: Attribute.BigInteger;
  };
}

export interface SharedCommentaire extends Schema.Component {
  collectionName: 'components_shared_commentaires';
  info: {
    displayName: 'commentaire_rd';
    description: '';
  };
  attributes: {
    second: Attribute.String;
    first: Attribute.String;
  };
}

export interface SharedCout extends Schema.Component {
  collectionName: 'components_shared_couts';
  info: {
    displayName: 'cout';
    description: '';
  };
  attributes: {
    cout: Attribute.Float;
  };
}

export interface SharedDateDeExamenRadiologique extends Schema.Component {
  collectionName: 'components_shared_date_de_examen_radiologiques';
  info: {
    displayName: 'Date_de_examen_radiologique';
  };
  attributes: {
    date: Attribute.String;
  };
}

export interface SharedDate1 extends Schema.Component {
  collectionName: 'components_shared_date1s';
  info: {
    displayName: 'date1';
  };
  attributes: {
    date: Attribute.String;
  };
}

export interface SharedDicom extends Schema.Component {
  collectionName: 'components_shared_dicoms';
  info: {
    displayName: 'DICOM';
  };
  attributes: {
    active: Attribute.Boolean;
    title: Attribute.String;
  };
}

export interface SharedForagePilote extends Schema.Component {
  collectionName: 'components_shared_forage_pilotes';
  info: {
    displayName: 'Forage pilote';
  };
  attributes: {
    title: Attribute.String;
    active: Attribute.Boolean;
  };
}

export interface SharedFullGuidee extends Schema.Component {
  collectionName: 'components_shared_full_guidees';
  info: {
    displayName: 'Full guid\u00E9e';
  };
  attributes: {
    titlle: Attribute.String;
    active: Attribute.Boolean;
  };
}

export interface SharedImpressionFormlabs extends Schema.Component {
  collectionName: 'components_shared_impression_formlabs';
  info: {
    displayName: 'Impression Formlabs\u00AE';
  };
  attributes: {
    title: Attribute.String;
    active: Attribute.Boolean;
    Guide_supplementaire: Attribute.BigInteger;
  };
}

export interface SharedLesOptionsGeneriquesCiDessous extends Schema.Component {
  collectionName: 'components_shared_les_options_generiques_ci_dessous';
  info: {
    displayName: 'les options g\u00E9n\u00E9riques ci-dessous';
    description: '';
  };
  attributes: {
    Suppression_numerique_de_dents: Attribute.Component<
      'shared.suppression-numerique',
      true
    >;
    Impression_Formlabs: Attribute.Component<
      'shared.impression-formlabs',
      true
    >;
    title: Attribute.String;
  };
}

export interface SharedLesOptionsGeneriques extends Schema.Component {
  collectionName: 'components_shared_les_options_generiques';
  info: {
    displayName: 'les options g\u00E9n\u00E9riques';
  };
  attributes: {
    active: Attribute.Boolean;
    title: Attribute.String;
  };
}

export interface SharedMarqueDeLImplantPourLaDent extends Schema.Component {
  collectionName: 'components_shared_marque_de_l_implant_pour_la_dents';
  info: {
    displayName: "Marque de l'implant pour la dent";
    description: '';
  };
  attributes: {
    title: Attribute.String;
    index_du_dent: Attribute.BigInteger;
    description: Attribute.String;
  };
}

export interface SharedMarqueDeLaClavette extends Schema.Component {
  collectionName: 'components_shared_marque_de_la_clavettes';
  info: {
    displayName: 'Marque de la clavette';
    description: '';
  };
  attributes: {
    title: Attribute.String;
    description: Attribute.String;
  };
}

export interface SharedMarqueDeLaTrousseDeChirugieUtilisee
  extends Schema.Component {
  collectionName: 'components_shared_marque_de_la_trousse_de_chirugie_utilisees';
  info: {
    displayName: 'Marque de la trousse de chirugie utilis\u00E9e';
    description: '';
  };
  attributes: {
    title: Attribute.String;
    description: Attribute.String;
  };
}

export interface SharedOption extends Schema.Component {
  collectionName: 'components_shared_options';
  info: {
    displayName: 'Option';
    icon: 'cursor';
    description: '';
  };
  attributes: {
    title: Attribute.String;
    active: Attribute.Boolean;
  };
}

export interface SharedOptionsGeneriques extends Schema.Component {
  collectionName: 'components_shared_options_generiques';
  info: {
    displayName: 'options g\u00E9n\u00E9riques';
    description: '';
  };
  attributes: {
    Smile_Design: Attribute.Component<'shared.option', true>;
    Impression_Formlabs: Attribute.Component<
      'shared.impression-formlabs',
      true
    >;
    Suppression_numerique: Attribute.Component<
      'shared.suppression-numerique',
      true
    >;
    title: Attribute.String;
  };
}

export interface SharedServiceDImpressionEtDExpedition
  extends Schema.Component {
  collectionName: 'components_shared_service_d_impression_et_d_expeditions';
  info: {
    displayName: "service d'impression et d'exp\u00E9dition";
    description: '';
  };
  attributes: {
    title: Attribute.String;
    active: Attribute.Boolean;
    active1: Attribute.Boolean;
  };
}

export interface SharedServiceImpressionEtExpedition extends Schema.Component {
  collectionName: 'components_shared_service_impression_et_expeditions';
  info: {
    displayName: 'service impression et expedition';
  };
  attributes: {
    title: Attribute.String;
    active: Attribute.Boolean;
  };
}

export interface SharedSuppressionNumerique extends Schema.Component {
  collectionName: 'components_shared_suppression_numeriques';
  info: {
    displayName: 'Suppression num\u00E9rique';
  };
  attributes: {
    title: Attribute.String;
    active: Attribute.Boolean;
    description: Attribute.String;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'shared.address': SharedAddress;
      'shared.clavettes-de-stabilisation': SharedClavettesDeStabilisation;
      'shared.commentaire': SharedCommentaire;
      'shared.cout': SharedCout;
      'shared.date-de-examen-radiologique': SharedDateDeExamenRadiologique;
      'shared.date1': SharedDate1;
      'shared.dicom': SharedDicom;
      'shared.forage-pilote': SharedForagePilote;
      'shared.full-guidee': SharedFullGuidee;
      'shared.impression-formlabs': SharedImpressionFormlabs;
      'shared.les-options-generiques-ci-dessous': SharedLesOptionsGeneriquesCiDessous;
      'shared.les-options-generiques': SharedLesOptionsGeneriques;
      'shared.marque-de-l-implant-pour-la-dent': SharedMarqueDeLImplantPourLaDent;
      'shared.marque-de-la-clavette': SharedMarqueDeLaClavette;
      'shared.marque-de-la-trousse-de-chirugie-utilisee': SharedMarqueDeLaTrousseDeChirugieUtilisee;
      'shared.option': SharedOption;
      'shared.options-generiques': SharedOptionsGeneriques;
      'shared.service-d-impression-et-d-expedition': SharedServiceDImpressionEtDExpedition;
      'shared.service-impression-et-expedition': SharedServiceImpressionEtExpedition;
      'shared.suppression-numerique': SharedSuppressionNumerique;
    }
  }
}
