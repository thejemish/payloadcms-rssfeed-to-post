import { CollectionConfig } from 'payload/types';
import Feed from '../components/Feed';

const feed: CollectionConfig = {
  slug: 'rss_feed',
  labels: {
    singular: "RSS Feed",
    plural: "RSS Feeds",
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'feed_name',
      label: "Feed Name",
      type: 'text',
      required: true,
    },
    {
      name: 'feed_url',
      label: "Feed URL",
      type: 'text',
      required: true,
    },
    {
      name: 'number_of_posts_to_import',
      label: "Number of Posts to Import",
      type: 'number',
      required: true,
    },
    {
      name: 'import',
      type: 'ui',
      admin: {
        components: {
          Field: Feed,
        },
        position: 'sidebar'
      },
    },
  ],
}

export default feed;
