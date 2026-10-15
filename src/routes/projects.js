import { Hono } from 'hono'
import { getProjectById, listProjects } from '../data/store.js'
import { sendCollection, sendResource } from '../utilis/response.js'
import { ApiError } from '../utilis/errors.js'

const projects = new Hono()

projects.get('/', (c) => {
  const data = listProjects()
  return sendCollection(c, data)
})

projects.get('/:id', (c) => {
  // const id = parseIdParam(c.req.param('id'))
  const project = getProjectById(+c.req.param('id'))

  if (!project) {
    throw new ApiError(404, 'NOT_FOUND', 'Project not found.')
  }

  return sendResource(c, project)
})

export default projects
