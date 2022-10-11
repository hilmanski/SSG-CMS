import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Page({repo, schema}: { repo: string, schema: string }) {
    const [collections, setCollections] = useState([])

    useEffect(() => {
        fetch(`/api/github-content?repository=${repo}&schema=${schema}`)
            .then(res => res.json())
            .then(res => {
                setCollections(res.body) 
            })
    }, [repo, schema])
        
    return (
        <div className=''>
            <h1 className='text-lg mb-5 font-bold'> Contents </h1>
            <Link href={`/form?repository=${repo}&schema=${schema}`}>New+</Link>
            {
                collections.length > 0 ? (
                    collections.map((collection, index) => {
                        return (
                            <Link key={index}
                                href={`/form?repository=${repo}&schema=${schema}&file=${collection['name']}&sha=${collection['sha']}`}>
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

export const getServerSideProps: GetServerSideProps = async (context) => {
    const repo = context.query.repository
    const schema = context.query.schema

    return {
        props: {
            repo, schema
        },
    }
  }