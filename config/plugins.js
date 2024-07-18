module.exports = ({ env }) => ({
  email: {
    config: {
      provider: "sendgrid",
      providerOptions: {
        apiKey: env("SENDGRID_API_KEY"),
      },
      settings: {
        defaultFrom: env("SENDGRID_DEFAULT_FROM"),
        defaultReplyTo: env("SENDGRID_DEFAULT_TO"),
      },
    },
  },
  upload: {
    config: {
      provider: "local",
      providerOptions: {
        sizeLimit: 100 * 1024 * 1024, // 100mb in bytes
      },
      breakpoints: {
        xlarge: 1920,
        large: 1000,
        medium: 750,
        small: 500,
        xsmall: 64,
      },
      actionOptions: {
        upload: {
          allowedTypes: {
            pdfFile: ["application/pdf"],
            model3d: [
              "application/zip",
              "application/x-tar",
              "application/x-rar-compressed",
              "application/x-7z-compressed",
            ],
          },
          fileExtensions: {
            pdfFile: ["pdf"],
            model3d: ["zip", "tar", "rar", "7z"],
          },
        },
      },
    },
  },
  "users-permissions": {
    config: {
      email: {
        enable: true,
        email_confirmation: true, // Enable email confirmation requirement
        email_confirmation_redirection: "http://localhost:5173/cabinet", // Adjust as necessary
      },
    },
  },
});
