import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

app.use('/*', cors({
  origin: [process.env.WEB_URL as string],
}))

app.get('/api', (c) => {
  return c.json({
    message: 'Hello Hono!'
  })
})

const port = process.env.PORT ? parseInt(process.env.PORT) : 3001

if (process.env.NODE_ENV === 'development') {
  console.log(`Server is running on http://localhost:${port}/api`)
}

serve({
  fetch: app.fetch,
  port
})