import { Hono } from 'hono'
import { getDb } from '../data/db'
import { deleteTask, getTaskById, updateTask } from '../data/tasks.repository'
import { parseJsonBody } from '../utilis/body'
import { ApiError } from '../utilis/errors'
import { sendResource } from '../utilis/response'
import { parseIdParam, validateTaskPatch } from '../utilis/validation'

const tasks = new Hono()

tasks.get('/:id', async (c) => {
  const id = parseIdParam(c.req.param('id'))
  const db = getDb(c.env.DB)
  const task = await getTaskById(db, id)

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

  const db = getDb(c.env.DB)
  const updatedTask = await updateTask(db, id, payload)

  if (!updatedTask) {
    throw new ApiError(404, 'NOT_FOUND', 'Task not found.')
  }

  return sendResource(c, updatedTask)
})

tasks.delete('/:id', async (c) => {
  const id = parseIdParam(c.req.param('id'))
  const db = getDb(c.env.DB)
  const deleted = await deleteTask(db, id)

  if (!deleted) {
    throw new ApiError(404, 'NOT_FOUND', 'Task not found.')
  }

  return c.body(null, 204)
})

export default tasks
