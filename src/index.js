import { Hono } from 'hono'
import projects from './routes/projects'

const app = new Hono()
const api = new Hono()

api.route('/projects', projects)

app.route('/api', api)

export default app
