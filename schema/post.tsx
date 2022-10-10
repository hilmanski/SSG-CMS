import { SchemaType } from './types'

// sample blog content

export default {
    name: 'post',
    title: 'Post',
    fields: [
      {
        name: 'name',
        title: 'Name',
        type: 'string'
      }
    ]
  } as SchemaType