import { buildConfig } from 'payload/config';
import path from 'path';
import Users from './collections/Users';
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { webpackBundler } from '@payloadcms/bundler-webpack'
import { slateEditor } from '@payloadcms/richtext-slate'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { samplePlugin } from '../../src/index'
import { cloudStorage } from '@payloadcms/plugin-cloud-storage';
import { s3Adapter } from '@payloadcms/plugin-cloud-storage/s3';

import Post from './collections/Post';
import Media from './collections/Media';

const cloudflare_r2_s3_compatible_adapter = s3Adapter({
  config: {
    endpoint: process.env.CLOUDFLARE_ENDPOINT,
    region: 'auto',
    credentials: {
      accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY || '',
    },
  },
  bucket: process.env.CLOUDFLARE_BUCKET || '',
});

export default buildConfig({
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
    webpack: config => {
      const newConfig = {
        ...config,
        resolve: {
          ...config.resolve,
          alias: {
            ...(config?.resolve?.alias || {}),
            react: path.join(__dirname, '../node_modules/react'),
            'react-dom': path.join(__dirname, '../node_modules/react-dom'),
            payload: path.join(__dirname, '../node_modules/payload'),
          },
        },
      }
      return newConfig
    },
  },
  editor: lexicalEditor({}),
  collections: [
    Media, Users, Post
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  plugins: [
    samplePlugin({ enabled: true }),
    cloudStorage({
      collections: {
        media: {
          adapter: cloudflare_r2_s3_compatible_adapter,
        },
      },
    }),],
  db: mongooseAdapter({
    url: process.env.DATABASE_URI,
  }),
})
