
export interface FieldType {
    name: string
    title: string
    type: string
    required: boolean
}

export type SchemaType = {
    name: string
    title: string
    fields: FieldType[]
}

// create type list of [index: string]: SchemaType
export type SchemaCollections = {[k: string] :SchemaType}