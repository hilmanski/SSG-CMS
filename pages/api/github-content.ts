import type { NextApiRequest, NextApiResponse } from 'next'
import dotenv from 'dotenv'
import { Octokit } from "octokit";
import CMSConfig from '../../cms.config.js'


dotenv.config()
const github_access_token = process.env.github_access_token
const admin_secret_code = process.env.admin_secret_code
const github_username = CMSConfig.github.username

let github_content_dir: any

const octokit = new Octokit({
  auth: github_access_token,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const { repository, schema, file } = req.query as {repository: string, schema: string, file?: string}
  if(!repository || !schema) {
    res.status(403).json({
      'message': 'Please provide required query param: repository and schema.'
    })
  }

  github_content_dir = CMSConfig.github?.repositories?.[repository]?.[schema]
  if(!github_content_dir || github_content_dir == '') {
   console.error('Error on getting content dir info @_getContent at API')
   throw new Error('Github Directory Not Found. Check you CMSConfig file')
  }

  //=================================
  //====== GET METHOD ===============
  //=================================
  if(req.method == 'GET') {

    console.log('file: ', file)
    // Single Content
    if(file !== undefined || file !== '') {
      const rawContent = await _getContent(repository, '/' + file) as any
      const content = _readBase64(rawContent.content)
      const dataObject = _desctructureMarkdown(content)
      
      return res.status(200).json({
          status: 'success',
          data: dataObject
      });
    }

    //All Contents
    const files = await _getContent(repository)
    return res.status(200).json({
        body: files
    });
  }

  //=================================
  //====== POST AND PUT =============
  //=================================
  const reqBody = req.body
  if (req.method === 'POST' || req.method === 'PUT') {
      const data = await _postOrUpdateContent(repository, reqBody, req.method)
      return res.status(200).json(({
          body: data,
          status: 'success'
      }))
  }
}

const _getContent = async(repository: string, filename: string = '') => {
  let path = github_content_dir + filename

  const {data} = await octokit.rest.repos.getContent({
    owner: github_username, 
    repo: repository,
    path: path
  });

  return data
}


const _postOrUpdateContent = async(repository: string, body: any, method: string) => {
  const parsedBody = JSON.parse(body)
  const filename = _convertToSlug(parsedBody) + '.md'
  
  // Todo: generate content here based on markdown and schema/fields
  const rawContent = _generateMarkdown(parsedBody) as string
  const content = _writeBase64(rawContent)
  const path = github_content_dir + '/' + filename
  
  let params = {
      owner: github_username, 
      repo: repository,
      path: path,
      message: `new content ${filename}`,
      content: content
  }

  
  // if(method == 'PUT') {
  //     params.sha = body.sha
  //     params.message = `update content ${filename}`
  // }

  try{ 
    const {data} = await octokit.rest.repos.createOrUpdateFileContents(
                          params
                        )
      return data
  } catch(err) {
      console.log("Error create or update file content to github")
      console.log("err response:", err)
      return err
  }
  
}

function _desctructureMarkdown(content: string) {
  // Todo: work in --- format too
  const header = content?.match(/(\++.*\++)/gs)
  if(!header){
    console.warn('Header is not provided')
    return {
      content
    }
  }

  const _content_ = content.substring(header[0].length)
  const _header = header[0].substring(4, header[0].length-4).trim().split(/\n/);

  let headers : any = {}
  _header.forEach((field: string) => {
    const [label, value] = field.split(/=\s+/)
    headers[label] = value
  });

  return {
    _content_, headers
  }
}

function _generateMarkdown(body: any) {
  const schema = body.schema
  const inputs = body.inputs

  let headerPart: string = __genHeader(schema, inputs)
  let contentPart: string = body.content

  return headerPart + '\n' + contentPart
}

function __genHeader(schema: any, inputs: any) {
  let header = ''
  schema.fields.map((key: any) => {
    const _name = key.name
    
    // Skip _content_ -> not part of header
    if(_name == '_content_')
      return

    let _value = ''
    let _key = `${_name}`
    switch(key.type) {
      case 'string':
      case 'text':
          _value = `"${inputs[_name]}"`
          break
      case 'date':
          let _date = new Date().toISOString()
          
          if(inputs[_name]) {
            _date = new Date(inputs[_name]).toISOString()
          }

          _value = `${_date}`
          break
      case 'array':
          if(_name.includes('/')) {
            _key= `"${_name}"`
          }

          let _tags = inputs[_name]
          // split tags by "," and make string with double quote
          _tags = _tags.replace(/ /g, "").split(',')
          _tags = _tags.map((tag: string) => `"${tag}"`)
          _value = `[${_tags}]`
    }

    header += `${_key} = ${_value}\n`
  })
  
  return `+++
${header}
+++`
}

function _readBase64(text: string) {
  return Buffer.from(text, 'base64').toString()
}

function _writeBase64(text: string) {
  return Buffer.from(text).toString('base64')
}

function _convertToSlug(body: any) {
  const slugKey = body.schema.asSlug
  const slugField = body.inputs[slugKey]

  return slugField.toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-');
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
