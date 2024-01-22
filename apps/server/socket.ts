import { io } from 'socket.io-client'

const perm =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZjRkM2E3NDQ1OGE1MDUyN2IwN2U2YzUiLCJpYXQiOjE3MDU3ODI1NTN9.-Ydiq6cQn1he8hlhgZ4Lw-3xFUvrbXwVbVvqA6IZGjY'

const value = perm

const socket = io('http://localhost:5000', {
  extraHeaders: {
    cookie: `@whatshare-access-token-1.0.0=${value}`,
  },
})

socket.on('connect', () => {
  console.log(socket.id) // x8WIv7-mJelg7on_ALbx

  setTimeout(() => {
    socket.emit('test', { ok: 'false' })
  }, 3000)
  // setInterval(() => {
  //   socket.emit('test')
  // }, 1000 * 20)
})

socket.on('exception', (error) => {
  console.log(error)
})
