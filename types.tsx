
interface Field {
    name: string
    title: string
    type: string
}

export interface SchemaType {
    name: string
    title: string
    fields: List[Field]
}