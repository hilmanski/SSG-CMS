import { GetServerSideProps } from 'next'
import { Schemas } from '../schema/_index'
import Field from '../components/Field'

export default function New({repo, schema}: { repo: string, schema: string }) {
    
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
            inputs[_name] = (_element[_name]).value
        });

        fetch(`/api/github-content?repository=${repo}&schema=${schema}`, {
            method: 'POST',
            body: JSON.stringify({
                inputs: inputs,
                schema: schemaProp
            })
        }).then(res => res.json())
           .then(res => {
                console.log(res)         
           }).catch(err => {
                console.log(err)
            })
    }

    return (
        <div>
            <h1 className='text-xl font-bold mb-10'>Create New {schema}</h1>

            <form onSubmit={(e) => handleSubmit(e)}
                className='flex flex-col space-y-4'>
                { schemaProp.fields.map((field, index) =>
                    <Field schemaProps={field} key={index} />
                )}

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