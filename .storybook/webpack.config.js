module.exports = ({ config }) => {
    config.resolve.fallback = {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
    };
  
    return config;
  };