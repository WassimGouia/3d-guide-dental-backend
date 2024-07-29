import logo from "./extensions/3dguidedental.png"
const config = {
  auth: {
    logo,
  },
  head: {
    favicon: logo,
  },
  menu: {
    logo,
  },

  translations: {
    en: {
      "app.components.LeftMenu.navbrand.title": "3D GUIDE DENTAL",

      "app.components.LeftMenu.navbrand.workplace": "By dentists for dentists",

      "Auth.form.welcome.title": "Welcome to 3d guide dental",

      "Auth.form.welcome.subtitle": "Login to your account",

      "Settings.profile.form.section.experience.interfaceLanguageHelp":
        "Preference changes will apply only to you.",
    },
  },
  tutorials: false,
  notifications: { releases: false },
};

const bootstrap = (app) => {
  console.log(app);
};

export default {
  config,
  bootstrap,
};
