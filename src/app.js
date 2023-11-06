import express from 'express'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import __dirname from './utils.js'
import viewsRouter from './routes/web/views.router.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static(`${__dirname}/public`))

app.engine('handlebars', handlebars.engine())
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars')

app.use('/', viewsRouter)

const server = app.listen(8080, console.log('Server running'))

const io = new Server(server)

const messages = []

io.on('connection', socket => {
  console.log('Cliente conectado')

  socket.on('authenticated', data => {
    socket.emit('messageLogs', messages)
    socket.broadcast.emit('newUserConnected', data)
  })

  socket.on('message', data => {
    messages.push(data)
    io.emit('messageLogs', messages)
  })
})
