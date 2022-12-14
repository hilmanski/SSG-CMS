import { StringifyOptions } from "querystring"

//==========================
//====== Config Github =====
//==========================
interface GithubContent {
    name: string;
    location_dir: string;
}

export interface GithubRepository {
    name: string;
    contents: GithubContent[];
}

export interface GithubConfigType {
    username: string;
    repositories: GithubRepository[];
}

//=============================
//====== Field and Schema =====
//=============================

export interface FieldType {
    name: string
    title: string
    type: StringifyOptions
    required?: boolean
}

export type SchemaType = {
    name: string
    title: string
    asSlug: string
    fields: FieldType[]
}

// create type list of [index: string]: SchemaType
export type SchemaCollections = {[k: string] :SchemaType}