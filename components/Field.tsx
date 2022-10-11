import { FieldType } from '../types'

export default function Field({ schemaProps, initialValue }: { schemaProps: FieldType, initialValue?: any }) {

    let fieldString = '' as string;
    switch (schemaProps.type) {
        case 'string':
            fieldString = `<input type="text" name="${schemaProps.name}" id="${schemaProps.name}" 
                                  placeholder="${schemaProps.name}" 
                                  value='${initialValue}'
                                  />`
            break
        case 'text':
            fieldString = `<textarea placeholder="${schemaProps.name}" name="${schemaProps.name}" id="${schemaProps.name}">${initialValue}</textarea>`
            break
        case 'array':
            // later user tagify
            if(schemaProps.name.includes("/")) {
                initialValue = `"${initialValue}"`
            }

            fieldString = `<input type="text" placeholder="${schemaProps.name}" name="${schemaProps.name}" id="${schemaProps.name}"
                            value='${initialValue}'/>
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