import { auth } from './googleAuth.js'

export async function walletRequest(method, path, body) {
  const client = await auth.getClient()
  const url = `https://walletobjects.googleapis.com${path}`
  const res = await client.request({ url, method, data: body })
  return res.data
}
