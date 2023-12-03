import type { StorybookConfig } from '@storybook/react-webpack5';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-onboarding",
    "@storybook/addon-interactions",
    "@storybook/preset-scss"
  ],
  "framework": {
    "name": "@storybook/react-webpack5",
    "options": {
      "builder": {
        "useSWC": true
      }
    }
  },
  "docs": {
    "autodocs": "tag"
  },
  babel: async (options) => ({
    ...options,
    presets: [
      ...options.presets ?? [],
      [
        '@babel/preset-react', {
          runtime: 'automatic',
        },
        'preset-react-jsx-transform' // Can name this anything, just an arbitrary alias to avoid duplicate presets'
      ],
    ],
  }),
  webpackFinal: async (config, { configType }) => {
    if (config.resolve) {
      config.resolve.plugins = [new TsconfigPathsPlugin()];
      config.resolve.alias = {
        ...config.resolve.alias,
        crypto: require.resolve('crypto-browserify'),
      };
    }
    return config;
  }
};
export default config;