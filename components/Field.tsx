import { FieldType } from '../types'

export default function Field({ schemaProps, initialValue }: { schemaProps: FieldType, initialValue?: any }) {

    let fieldString = '' as string;
    initialValue = initialValue ?? ''

    switch (schemaProps.type) {
        case 'string':
            // remove doublequote on first and last char
            initialValue = initialValue.replace(/^"(.*)"$/, '$1')

            fieldString = `<input type="text" name="${schemaProps.name}" id="${schemaProps.name}" 
                                  placeholder="${schemaProps.name}" 
                                  value='${initialValue}'
                                  class='w-full'
                                  />`
            break
        case 'text':
            initialValue = initialValue.replace(/^"(.*)"$/, '$1')
            fieldString = `<textarea placeholder="${schemaProps.name}" name="${schemaProps.name}" 
                            id="${schemaProps.name}" class='w-full'>${initialValue}</textarea>`
            break
        case 'boolean':
            console.log('initialValue: ' + initialValue)
            const checked = (initialValue == 'true') ? 'checked' : ''
            fieldString = `<input type="checkbox" ${checked} name="${schemaProps.name}" id="${schemaProps.name}" />`
            break
        case 'array':
            // later user tagify
            // remove bracket [] and quotes
            initialValue = initialValue.replace(/[\[\]"]+/g, '')
            fieldString = `<input type="text" placeholder="${schemaProps.name}" name="${schemaProps.name}" 
                            id="${schemaProps.name}"  class='w-full'
                            value='${initialValue}'/>
                 Separate multiple values with comma`
            break
        case 'date':
            initialValue = initialValue.replace('Z', '')
            fieldString = `<input type="datetime-local" placeholder="${schemaProps.name}" name="${schemaProps.name}" 
                            id="${schemaProps.name}" value='${initialValue}'  class='w-full' />`
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