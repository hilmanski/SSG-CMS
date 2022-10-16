import { GithubConfigType } from './types'

// Config your file here
export const CMSConfig = {
    username: 'hilmanski',
    repositories: [
        {
            'name' : 'bikinspace',
            'contents': [
                {
                    'name': 'post',
                    'location_dir': 'content/posts'
                },
                {
                    'name': 'link',
                    'location_dir': 'content/link'
                }
            ]
        }
    ]
} as GithubConfigType

  