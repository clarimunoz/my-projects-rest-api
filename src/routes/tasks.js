import { Hono } from 'hono'
import { getDb } from '../data/db'
import {
  deleteTask,
  getTaskByIdForUser,
  updateTask,
} from '../data/tasks.repository'
import { parseJsonBody } from '../utilis/body'
import { ApiError } from '../utilis/errors'
import { sendResource } from '../utilis/response'
import { parseIdParam, validateTaskPatch } from '../utilis/validation'

const tasks = new Hono()

tasks.get('/:id', async (c) => {
  const userId = c.get('user').sub
  const id = parseIdParam(c.req.param('id'))
  const db = getDb(c.env.DB)
  const task = await getTaskByIdForUser(db, id, userId)

  if (!task) {
    throw new ApiError(404, 'NOT_FOUND', 'Task not found.')
  }

  return sendResource(c, task)
})

tasks.patch('/:id', async (c) => {
  const userId = c.get('user').sub
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

  const task = await getTaskByIdForUser(db, id, userId)

  if (!task) {
    throw new ApiError(404, 'NOT_FOUND', 'Task not found.')
  }
  const updatedTask = await updateTask(db, id, payload, userId)

  if (!updatedTask) {
    throw new ApiError(404, 'NOT_FOUND', 'Task not found.')
  }

  return sendResource(c, updatedTask)
})

tasks.delete('/:id', async (c) => {
  const userId = c.get('user').sub
  const id = parseIdParam(c.req.param('id'))
  const db = getDb(c.env.DB)
  const task = await getTaskByIdForUser(db, id, userId)

  if (!task) {
    throw new ApiError(404, 'NOT_FOUND', 'Task not found.')
  }
  await deleteTask(db, id)

  return c.body(null, 204)
})

export default tasks
