import type { NextApiRequest, NextApiResponse } from 'next'
import dotenv from 'dotenv'
import { Octokit } from "octokit";
import CMSConfig from 'cms.config'


dotenv.config()
const github_access_token = process.env.github_access_token
const admin_secret_code = process.env.admin_secret_code
const github_username = CMSConfig.github.username

const octokit = new Octokit({
  auth: github_access_token,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const { repository, schema } = req.query as {repository: string, schema: string}
  if(!repository || !schema) {
    res.status(403).json({
      'message': 'Please provide required query param: repository and schema.'
    })
  }

  console.log('Repository: ', repository)

  if(req.method == 'GET') {
    // Single Content
    const {file} = req.query as typeof req.query & {file?: string}
    if(file !== undefined){
      const rawContent = await _getContent(repository, schema, '/' + file)
      const content = _readBase64(rawContent.content)
      
      return res.status(200).json({
          body: content
      });
    }

    //All Contents
    const files = await _getContent(repository, schema)
    return res.status(200).json({
        body: files
    });
  }

  res.status(200).json({ name: 'John Doe' })
}

const _getContent = async(repository: string, schema: string, filename: string = '') => {
  const github_content_dir = CMSConfig.github.repositories[repository][schema]
  
  if(!github_content_dir)  {
   console.error('Error on getting content dir info @_getContent at API')
   throw new Error('Github Directory Not Found. Check you CMSConfig file')
  }

  let path = github_content_dir + filename

  const {data} = await octokit.rest.repos.getContent({
    owner: github_username, 
    repo: repository,
    path: path
  });

  return data
}

function _readBase64(text: string) {
  return Buffer.from(text, 'base64').toString()
}

// Refactor this to Vercel Handler


// module.exports = async (req, res) => {
    
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     res.setHeader('Access-Control-Allow-Credentials', true);
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, OPTIONS, DELETE');

//     if(req.method === 'GET') {
//         //Single Content
//         const file = req.query.file
//         if(file !== undefined) {
//             const rawContent = await getContent('/' + file)
//             const content = readBase64(rawContent.content)
            
//             return res.status(200).json({
//                 body: content
//             });
//         }

//         //All Content
//         const files = await getContent()
//         return res.status(200).json({
//             body: files
//         });
//     }

//     //Admin Middleware
//     let reqBody = req.body
    
//     if (reqBody) {
//         if (verifySecretCode(reqBody) == false)
//            return res.status(403).send({
//                 msg: 'secret code is not provided or wrong'
//             })
//     }

//     if (req.method === 'POST' || req.method === 'PUT') {
//         const data = await postOrUpdateContent(reqBody, req.method)
//         return res.status(200).json(({
//             body: data
//         }))
//     }

//     if (req.method === 'DELETE') {
//         const data = await deleteContent(reqBody)
//         return res.status(200).json(({
//             body: data
//         }))
//     }

//     //Preflight CORS handler
//     if(req.method === 'OPTIONS') {
//         return res.status(200).json(({
//             body: "OK"
//         }))
//     }
// }

// const getContent = async(filename = '') => {
//   let path = repo_dir + filename

//   const {data} = await octokit.rest.repos.getContent({
//     owner: github_username, 
//     repo: github_repo,
//     path: path
//   });

//   return data
// }

// const postOrUpdateContent = async(body, method) => {
//     const filename = body.filename
//     const originalContent = body.content

//     const content = writeBase64(originalContent)
//     const path = repo_dir + '/' + filename

//     let params = {
//         owner: github_username, 
//         repo: github_repo,
//         path: path,
//         message: `new content ${filename}`,
//         content: content
//     }

//     if(method == 'PUT') {
//         params.sha = body.sha
//         params.message = `update content ${filename}`
//     }

//     const {data, error} = await octokit.rest.repos.createOrUpdateFileContents(
//                         params
//                     )
//     console.log(error)
//     return data
// }

// const deleteContent = async(body, method) => {
//     const filename = body.filename
//     const path = repo_dir + '/' + filename

//     const {data, error} = await octokit.rest.repos.deleteFile({
//                         owner: github_username, 
//                         repo: github_repo,
//                         path: path,
//                         message: `delete content ${filename}`,
//                         sha: body.sha
//                     })

//     console.log(error)
//     return data
// }

// function verifySecretCode(reqBody) {
//   if(reqBody.secret_code == undefined)
//     return false

//   if(admin_secret_code != reqBody.secret_code)
//     return false

//   return true
// }

// function readBase64(str) {
//     return Buffer.from(str, 'base64').toString()
// }

// function writeBase64(str) {
//     return Buffer.from(str).toString('base64')
// }