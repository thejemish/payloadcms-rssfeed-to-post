import { CollectionConfig } from 'payload/types'

const Post: CollectionConfig = {
    slug: 'post',
    labels: {
        singular: 'Post',
        plural: 'Posts'
    },
    access: {
        read: () => true,
        update: () => true,
        create: () => true,
    },
    versions: {
        drafts: true
    },
    // admin: {
    //     useAsTitle: "image",
    // },
    fields: [
        {
            name: 'image',
            type: 'upload',
            relationTo: 'media',
            required: true,
        },
        {
            name: "title",
            label: "Title",
            type: "text",
            required: true,
        },
        {
            name: 'content',
            label: 'Content',
            type: 'richText',
            required: true,
        },
    ],

}

export default Post