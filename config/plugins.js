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
    // Add this line
    config: {
      provider: "aws-s3",
      providerOptions: {
        accessKeyId: env("AWS_ACCESS_KEY_ID"),
        secretAccessKey: env("AWS_ACCESS_SECRET"),
        region: env("AWS_REGION"),
        params: {
          Bucket: env("AWS_BUCKET"),
        },
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  }, // Add this line
  "users-permissions": {
    config: {
      email: {
        enable: true,
        email_confirmation: true,
        email_confirmation_redirection: "http://92.222.101.80:3000/cabinet",
      },
    },
  },
});