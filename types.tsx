import { StringifyOptions } from "querystring"

export interface FieldType {
    name: string
    title: string
    type: StringifyOptions
    required: boolean
}

export type SchemaType = {
    name: string
    title: string
    asSlug: string
    fields: FieldType[]
}

// create type list of [index: string]: SchemaType
export type SchemaCollections = {[k: string] :SchemaType}