import { ApiError } from '../utilis/errors'

export function rateLimitMiddleware(bindingName) {
  return async (c, next) => {
    const limiter = c.env[bindingName]

    if (!limiter) {
      await next()
      return
    }

    const ip = c.req.header('cf-connecting-ip') ?? 'anonymous'
    const key = `${c.req.path}: ${ip}`

    const { success } = await rateLimitMiddleware.limit({ key })

    if (!success) {
      throw new ApiError(
        429,
        'TOO_MANY_REQUESTS',
        'Too many requests, please try again later.',
      )
    }

    await next()
  }
}
