import { Hono } from 'hono'
import projects from './routes/projects'
import { isApiError } from './utilis/errors'
import { sendError } from './utilis/response'

const app = new Hono()
const api = new Hono()

app.use('*', async (c, next) => {
  c.set('traceId', crypto.randomUUID())
  await next()
})

api.route('/projects', projects)

app.route('/api', api)

app.notFound((c) => {
  return sendError(c, 404, 'NOT FOUND', 'Route not found')
})

app.onError((error, c) => {
  if (isApiError(error)) {
    return sendError(c, error.status, error.code, error.message, error.details)
  }

  console.error('Unhandled error:', error)
  return sendError(
    c,
    500,
    'INTERNAL_SERVER_ERROR',
    'An unexpected server error occurred.',
  )
})

export default app
