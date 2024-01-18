require('dotenv').config()

import app from './src'
import { env } from 'process'

const port = env.PORT || 3000

app.listen(port, () =>
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`)
)