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

    return (
        <div>
            <h1 className='text-xl font-bold mb-10'>Create New {schema}</h1>

            <form>
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