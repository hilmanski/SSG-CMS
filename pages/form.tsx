import { GetServerSideProps } from 'next'
import { Schemas } from '../schema/_index'
import Field from '../components/Field'
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react'


const DynamicMarkdownEditor = dynamic(() => import('../components/MarkdownEditor'), { ssr: false });

export default function New({repo, schema, file='', sha=''}: 
    { repo: string, schema: string, file: string, sha: string}) {

    const [_content_, set_content_] = useState('')
    
    const schemaProp = Schemas[schema]
    if(!schemaProp){
        return(
            <div>
                <p>Schema Not Found</p>
                <p>Make sure to create the schema file and register to schema/_index</p>
            </div>
        )
    }

    // Load content if file is not empty
    if(file != '' && sha != '') {
        // Load content here
        //  at backend descturcure back into key-value pair
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

        fetch(`/api/github-content?repository=${repo}&schema=${schema}`, {
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
        console.log('content', content)
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
                                initialValue='Today I learn...'
                                onChange={handleMarkdownContentChange} />
                    }
                    
                    return <Field schemaProps={field} key={index} />
                })}

                <input type='submit' 
                        className='p-2 bg-sky-400 w-full rounded-lg mt-3'
                        value='create' />
            </form>

        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const repo = context.query.repository
    const schema = context.query.schema
    
    return {
        props: {
            repo, schema
        },
    }
  }