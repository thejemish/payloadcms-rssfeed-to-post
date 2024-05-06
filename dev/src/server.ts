import express from 'express'
import payload from 'payload'
import { InitOptions } from 'payload/config'
import cors from 'cors';

require('dotenv').config()
const app = express()

app.use(cors({
  origin: 'http://localhost:3001/',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));


// Redirect root to Admin panel
app.get('/', (_, res) => {
  res.redirect('/admin')
})

export const start = async (args?: Partial<InitOptions>) => {
  // Initialize Payload
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    express: app,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`)
    },
    ...(args || {}),
  })

  // Add your own express routes here

  app.listen(3001)
}

start()
