import express, { Request, Response, NextFunction } from "express";
import createError from "http-errors"

import authRouter from "./routers/auth-router"
import urlRouter from "./routers/url-router"

const app = express()

app.use(express.json())

// ROUTING
app.use('/api/auth', authRouter)
app.use('/api/url', urlRouter)


// handle 404 error
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404))
})

export default app
