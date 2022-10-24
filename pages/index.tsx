import Link from 'next/link'
import { useState, useEffect } from 'react'
import { getRepositories, findRepo } from '../utils/helper'

export default function Home(){
  const repositories = getRepositories()

  return (
      <div>
            <h1 className="text-3xl font-bold underline">
              Hello CMS. 
            </h1>
            <h2 className='text-xl mb-10'>
              Your repositories:
            </h2>

            <div className='text-xl'>
            {
              repositories.length > 0 ? (
                repositories.map((content: any, index: number) => {
                  return (
                    <div key={index}>
                      <p>{content.name}</p>
                      <SchemaComponent repoName={content.name as string} />
                    </div>
                  )
              })) 
              : <p> Add your repositories on cms.config.js file </p>
            }
            </div>
        </div>
  )
}

function SchemaComponent({repoName} 
    : {repoName: string }) {
    const repository = findRepo(repoName)

  return (
    <div className='ml-5'>
       {
          repository?.contents.map((content: any, index: number) => {
            return (
              <div key={index}>
                <Link href={`/projects/${repoName}/${content.name}`}>
                  <a className='text-xl underline'>
                    {content.name}
                  </a>
                </Link>
              </div>
            )
          })
        }
    </div>
  )
}
