import { FieldType } from '../types'

export default function Field({ schemaProps }: { schemaProps: FieldType }){

    let fieldString = '' as string;
    switch (schemaProps.type) {
        case 'string':
            fieldString = `<input type="text" name="${schemaProps.name}" id="${schemaProps.name}" placeholder="${schemaProps.name}" />`
            break
        case 'text':
            fieldString = `<textarea placeholder="${schemaProps.name}" name="${schemaProps.name}" id="${schemaProps.name}"></textarea>`
            break
        case 'array':
            // later user tagify
            fieldString = `<input type="text" placeholder="${schemaProps.name}" name="${schemaProps.name}" id="${schemaProps.name}" />
                 Separate multiple values with comma`
            break
        case 'date':
            fieldString = `<input type="datetime-local" placeholder="${schemaProps.name}" name="${schemaProps.name}" id="${schemaProps.name}" />`
            break
    }

    if(schemaProps.required) {
        fieldString += `<p>*required<p>`
    }

    return(
        <div>
            <label htmlFor={schemaProps.name} className='text-lg font-bold'>{schemaProps.title}</label>
            <div dangerouslySetInnerHTML={{ __html: fieldString as string }} />
        </div>
    )
}