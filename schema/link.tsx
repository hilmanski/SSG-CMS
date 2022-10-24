// This is user generated sample file

import { SchemaType } from '../types'

export default {
    name: 'link',
    title: 'Link',
    asSlug: 'title',
    fields: [
      {
        name: 'title',
        title: 'Title',
        type: 'string',
        required: true
      },
      {
        name: 'site_url',
        title: 'Url',
        type: 'string',
        required: true
      },
      {
        name: 'description',
        title: 'Description',
        type: 'text',
        required: true
      },
      {
        name: 'link/tags',
        title: 'Tags',
        type: 'array',
        required: true,
      },
      {
        name: 'logo',
        title: 'Logo (Img)',
        type: 'string',
        required: true,
      }, 
      {
        name: 'date',
        title: 'Date',
        type: 'date',
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