// This is user generated sample file

import { SchemaType } from '../types'

export default {
    name: 'post',
    title: 'Post',
    asSlug: 'title',
    fields: [
      {
        name: 'title',
        title: 'Title',
        type: 'string',
        required: true
      },
      {
        name: 'draft',
        title: 'Draft',
        type: 'boolean'
      },
      {
        name: 'description',
        title: 'Description',
        type: 'text',
        required: true
      },
      {
        name: 'date',
        title: 'Date',
        type: 'date',
        required: true,
      }, 
      {
        name: 'posts/tags',
        title: 'Tags',
        type: 'array',
        required: true,
      },
      {
        name: '_content_',
        title: 'Content',
        type: 'text',
        required: true,
      }
    ]
  } as SchemaType