const socket = io()
let user
const textbox = document.querySelector('#textBox')
const messagebox = document.querySelector('#messagesBox')

Swal.fire({
  title: 'Identificate',
  input: 'text',
  text: 'Ingresa el usuario para identificarte en el chat',
  inputValidator: value => {
    return !value && 'Escribe un nombre de usuario para continuar'
  },
  allowOutsideClick: false,
  allowEscapeKey: false
}).then(result => {
  user = result.value
  socket.emit('authenticated', user)
})

textbox.addEventListener('keyup', e => {
  if (e.key === 'Enter') {
    if (textbox.value.trim().length > 0) {
      socket.emit('message', { user, message: textbox.value })
      textbox.value = ''
    }
  }
})

socket.on('messageLogs', data => {
  let messages = ''
  data.forEach(message => {
    messages += `${message.user}: ${message.message} <br/>`
  })

  messagebox.innerHTML = messages
})

socket.on('newUserConnected', data => {
  Swal.fire({
    toast: true,
    position: 'top-end',
    showConfirmationButton: false,
    timer: 3000,
    title: `${data} se ha unido al chat`,
    icon: 'success'
  })
})
