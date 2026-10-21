import { Hono } from 'hono'
import { deleteTask, getTaskById, updateTask } from '../data/store'
import { parseJsonBody } from '../utilis/body'
import { ApiError } from '../utilis/errors'
import { sendResource } from '../utilis/response'
import { parseIdParam, validateTaskPatch } from '../utilis/validation'

const tasks = new Hono()

tasks.get('/:id', (c) => {
  const id = parseIdParam(c.req.param('id'))
  const task = getTaskById(id)

  if (!task) {
    throw new ApiError(404, 'NOT_FOUND', 'Task not found.')
  }

  return sendResource(c, task)
})

tasks.patch('/:id', async (c) => {
  const id = parseIdParam(c.req.param('id'))
  const payload = await parseJsonBody(c)
  const details = validateTaskPatch(payload)

  if (details.length > 0) {
    throw new ApiError(
      422,
      'VALIDATION_ERROR',
      'Some fields are invalid.',
      details,
    )
  }

  const updatedTask = updateTask(id, payload)

  if (!updatedTask) {
    throw new ApiError(404, 'NOT_FOUND', 'Task not found.')
  }

  return sendResource(c, updatedTask)
})

tasks.delete('/:id', (c) => {
  const id = parseIdParam(c.req.param('id'))
  const deleted = deleteTask(id)

  if (!deleted) {
    throw new ApiError(404, 'NOT_FOUND', 'Task not found.')
  }

  return c.body(null, 204)
})

export default tasks
