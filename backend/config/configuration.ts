export default () => ({
    database: {
      uri: process.env.MONGO_URI_DOCKER || process.env.MONGO_URI_HOST
    }
  });