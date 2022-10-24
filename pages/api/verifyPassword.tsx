import type { NextApiRequest, NextApiResponse } from 'next'
import dotenv from 'dotenv'

dotenv.config()

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {

    const { password } = req.body
    const admin_secret_code = process.env.admin_secret_code

    console.log(' veryfying if ' + password + ' is equal to ' + admin_secret_code)

    if(password === admin_secret_code) {
        res.status(200).json({status: 'success'})
    }
    else {
        res.status(200).json({status: 'failed'})
    }
}