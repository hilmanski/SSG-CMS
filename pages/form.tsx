import { GetServerSideProps } from 'next'
import { Schemas } from '../schema/_index'
import Field from '../components/Field'
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react'


const DynamicMarkdownEditor = dynamic(() => import('../components/MarkdownEditor'), { ssr: false });

export default function New({repository, schema, fileData={}}: 
    { repository: string, schema: string, fileData: any}) {
    
    const [_content_, set_content_] = useState('')
    const initalValue = fileData._content_ ?? 'Today I learn...';
    
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

            inputs[_name] = (_element[_name]).value
        });

        fetch(`/api/github-content?repository=${repository}&schema=${schema}`, {
            method: 'POST',
            body: JSON.stringify({
                inputs: inputs,
                schema: schemaProp,
                content: _content_
            })
        }).then(res => res.json())
           .then(res => {
                if(res.status == 'success') {
                    alert('Successfully push to Github!')
                    window.location.href='/'
                }
           }).catch(err => {
                console.log(err)
            })
    }

    function handleMarkdownContentChange(content: any) {
        set_content_(content);
    }

    return (
        <div>
            <h1 className='text-xl font-bold mb-10'>Create New {schema}</h1>

            <form onSubmit={(e) => handleSubmit(e)}
                className='flex flex-col space-y-4'>
                { schemaProp.fields.map(function(field, index){
                    if(field.name == '_content_') {
                       return <DynamicMarkdownEditor
                                key={index}
                                initialValue={initalValue}
                                onChange={handleMarkdownContentChange} />
                    }
                    
                    return <Field schemaProps={field} key={index} />
                })}

                <input type='submit' 
                       value='create'
                       className='p-2 bg-sky-400 w-full rounded-lg mt-3'
                        />
            </form>

        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    
    const { req } = context;
    const url = req.headers.referer;
    const host = url?.includes('localhost') ? `http://${req.headers.host}` : url?.split('https://')[1].split('/')[0]

    const {repository, schema, file, sha} 
        = context.query as { repository: string, schema: string, file: string, sha:string }
    
    let fileData = {}

    if(file != undefined && sha != undefined) {
        const res = await fetch(`${host}/api/github-content?repository=${repository}&schema=${schema}&file=${file}`)
        const resJson = await res.json();
        if(resJson.status != 'success'){
            console.log(console.error(res))
        }

        fileData = resJson.data
    }

    return {
        props: {
            repository, schema, fileData
        },
    }
  }