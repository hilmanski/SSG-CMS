import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function Page() {
    const {asPath} = useRouter()
    const [collections, setCollections] = useState([])
    const [repository, setRepository] = useState("")
    const [schema, setSchema] = useState("")

    // make fetch api request from /api/getContents
    // with the received params {repo, schema}.
    useEffect(() => {
        const paths = asPath.split('/').slice(2)
        
        // Not ready yet
        if(paths[0] == '[repository]')
            return

        setRepository(paths[0])
        setSchema(paths[1])

        fetch(`/api/get-contents?repository=${paths[0]}&schema=${paths[1]}`)
            .then(res => res.json())
            .then(res => {
                setCollections(res.body) 
            })
    }, [asPath])
        
    return (
        <div className='w-1/2 mx-auto mt-10'>
            <h1 className='text-lg mb-5 font-bold'> Contents </h1>
            <Link href={`/new?repository=${repository}&schema=${schema}`}>New+</Link>
            {
                collections.length > 0 ? (
                    collections.map((collection, index) => {
                        return (
                            <Link key={index}
                                href={`/edit?repository=${repository}&schema=${schema}&file=${collection['name']}&sha=${collection['sha']}`}>
                                <p className='cursor-pointer underline'> {collection['name']}</p>
                            </Link>
                        )
                    })
                ) : (
                    <p> Loading... </p>
                )
            }

        </div>
    )
}