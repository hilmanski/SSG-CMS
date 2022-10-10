import type { NextPage } from 'next'
import Link from 'next/link'
import CMSConfig from 'cms.config'

const Home: NextPage = () => {
  
  const repositories = _getObjectKeys(CMSConfig.github.repositories)

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
          repositories.map(function(repoName: string, index){
           return (
              <div key={index}>
                <p>Repository: {repoName}</p>
                <div className='ml-5'>
                  {
                    SchemaComponent(repoName)
                  }
                </div>
              </div>
           )
        })) 
        : <p> Add your repositories on cms.config.js file </p>
      }
      </div>

    </div>
  )
}

function _getObjectKeys(obj: any) {
  return Object.keys(obj)
}

function SchemaComponent(repoName: string) {
  return _getObjectKeys(CMSConfig.github.repositories[repoName])
            .map((schema, _index) => {
              return (
                <Link key={_index} href={`projects/${repoName}/${schema}`}> 
                  <p className='underline cursor-pointer'> Content: {schema} </p>
                </Link>            
              )
            })
}

export default Home

