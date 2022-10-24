import { GetServerSideProps } from 'next'
import { Schemas } from '../schema/_index'
import Field from '../components/Field'
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react'
import { getCookie, removeCookie, getStorageKeyNameForSecretCode } from '../utils/cookies'


const DynamicMarkdownEditor = dynamic(() => import('../components/MarkdownEditor'), { ssr: false });

export default function New({repository, schema, fileData={}, isEdit, sha}: 
    { repository: string, schema: string, fileData: any, isEdit: boolean, sha?: string | undefined }) {
    
    const [_content_, set_content_] = useState('')
    const initalValue = fileData._content_ ?? 'Today I learn...';
    const initialHeaders = fileData.headers ?? [];

    const STORAGE_NAME_FOR_CODE = getStorageKeyNameForSecretCode()
    const secretCode = getCookie(STORAGE_NAME_FOR_CODE);

    // set _content_ to initial value
    useEffect(() => {
        set_content_(fileData._content_ ?? '')
    }, [fileData._content_])
    
    const schemaProp = Schemas[schema]
    if(!schemaProp){
        return(
            <div>
                <p>Schema Not Found</p>
                <p>Make sure to create the schema file and register to schema/_index</p>
            </div>
        )
    }
  
    type Element = {
        [key: string]: any;
    };
    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const target = e.target as HTMLFormElement
        
        // build key value based on schemaProp fields and target.elements[schemaProps])
        let inputs = {} as any
        schemaProp.fields.map((key: any) => {
            const _name = key.name as string;
            const _element: Element = target.elements

            if(_name == '_content_')
                return null

            if(key.type == 'boolean') {
                const isChecked = _element[_name].checked
                inputs[_name] = isChecked
                return
            }

            inputs[_name] = (_element[_name]).value
        });

        let method = "POST"
        if(isEdit == true) {
            method = "PUT"
        }

        fetch(`/api/githubCRUD?repository=${repository}&schema=${schema}`, {
            method: method,
            body: JSON.stringify({
                inputs: inputs,
                schema: schemaProp,
                content: _content_,
                sha: sha ?? '',
                secretCode: secretCode
            })
        }).then(res => res.json())
           .then(res => {
                if(res.status == 'error') {
                    if(res.message == 'WRONG SECRET CODE') {
                        alert('Wrong Secret Code. You need to authenticate again')
                        removeCookie(STORAGE_NAME_FOR_CODE)
                        window.location.href = '/'
                        return
                    }
                }

                if(isEdit) {
                    const keySlug = schemaProp.asSlug
                    const newTitle = (document.getElementById(keySlug) as HTMLInputElement).value
                    const oldTitle = _getTitleForSlug().replace(/^"(.*)"$/, '$1')
                    const filename = _convertToSlug(oldTitle)+ '.md'
                    
                    if(oldTitle != newTitle) {
                        console.log('deleting old file...', oldTitle)
                        deleteContent(filename) 
                    }
                }
            
                if(res.status == 'success') {
                    alert('Successfully deployed to Github!')
                    window.location.href='/'
                }
           }).catch(err => {
                console.log(err)
            })
    }

    function handleMarkdownContentChange(content: any) {
        set_content_(content);
    }

    function deleteContent(filename = '') {
        if(filename == '')
            filename = getFileName()

        fetch(`/api/githubCRUD?repository=${repository}&schema=${schema}`, {
            method: 'DELETE',
            body: JSON.stringify({
                filename: filename,
                sha: sha ?? '',
                secretCode: secretCode
            })
        }).then(res => res.json())
           .then(res => {
                if(res.status == 'error') {
                    if(res.message == 'WRONG SECRET CODE') {
                        alert('Wrong Secret Code. You need to authenticate again')
                        removeCookie(STORAGE_NAME_FOR_CODE)
                        window.location.href = '/'
                        return
                    }
                }

                if(res.status == 'success') {
                    alert('Successfully delete content!')
                    window.location.href='/'
                }
           }).catch(err => {
                console.log(err)
            })
    }

    function getFileName() {
        return _convertToSlug(_getTitleForSlug()) + '.md'
    }

    function _getTitleForSlug(): string {
        return initialHeaders[schemaProp.asSlug]
    }

    function _convertToSlug(text: string) {
        return text.toLowerCase()
                  .replace(/[^\w ]+/g, '')
                  .replace(/ +/g, '-');
      }

    return (
        <div>
            <div className='flex justify-between'>
                <h1 className='text-xl font-bold mb-10'>
                    { isEdit ? 'Edit ' : 'New' } {schemaProp.name}
                </h1>

                {/* delete button */}
                {isEdit &&
                    <button onClick={() => deleteContent()}
                        className='bg-red-500 text-white p-1 h-[25px] text-xs rounded-md hover:bg-red-600'>
                        Delete Content
                    </button>
                }
            </div>

            <form onSubmit={(e) => handleSubmit(e)}
                className='flex flex-col space-y-4'>
                { schemaProp.fields.map(function(field, index){
                    if(field.name == '_content_') {
                       return <DynamicMarkdownEditor
                                key={index}
                                initialValue={initalValue}
                                onChange={handleMarkdownContentChange} />
                    }

                    let _value = initialHeaders[field.name]
                    // For handling edgecase name with "/" backslash
                    if(field.name.includes("/")) {
                         _value = initialHeaders['"'+ field.name + '"']
                    }
                    
                    return <Field schemaProps={field} 
                                  key={index} 
                                  initialValue={_value} 
                                  />
                })}

                <input type='submit' 
                       value={isEdit ? 'Update' : 'Create New' }
                       className='p-2 bg-sky-400 w-full rounded-lg mt-3 cursor-pointer hover:bg-sky-500'
                        />
            </form>

        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { req } = context;
    const url = req.headers.referer;
    const host = url?.includes('localhost') ? `http://${req.headers.host}`
                                            : url?.split('https://')[1].split('/')[0]

    let {repository, schema, file, sha} 
        = context.query as { repository: string, schema: string, file: string, sha:string | undefined | null }

    let fileData = {}
    let isEdit = false

    if(file != undefined && sha != undefined) {
        const res = await fetch(`${host}/api/githubCRUD?repository=${repository}&schema=${schema}&file=${file}`)
        const resJson = await res.json();
        if(resJson.status != 'success'){
            console.log(console.error(res))
        }

        isEdit = true
        fileData = resJson.data
    }
    
    if(sha == undefined) 
        sha = null

    return {
        props: {
            repository, schema, fileData, isEdit, sha
        },
    }
  }