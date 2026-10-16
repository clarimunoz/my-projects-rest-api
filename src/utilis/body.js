import { ApiError } from './errors'

export async function parseJsonBody(c) {
  try {
    return await c.req.json()
  } catch {
    throw new ApiError(400, 'BAD_REQUEST', 'Malformed JSON request body.')
  }
}
