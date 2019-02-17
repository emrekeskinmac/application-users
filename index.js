const mesg = require('mesg-js').application()
const debug = require('debug')('user-service')
const error = require('debug')('user-service:error')
const { 
  createUser,
  updateUser,
  updateEmail,
  updatePassword,
  sendEmailVerification,
  verifyEmail
} = require('./funcs/user')
const {
  listenRequests,
} = require('./funcs/http-server')

listenRequests(mesg)
  .on('data', async (event) => {
    const data = JSON.parse(event.eventData)
    const sessionID = data.sessionID
    try {      
      switch (data.path) {
        case "/user.create":
          if (data.method === "POST") await createUser(mesg, sessionID, { inputData: data.body })
          break;
        case "/user.update":
          if (data.method === "POST") await updateUser(mesg, sessionID, { inputData: data.body })
          break;
        case "/user.updateEmail":
          if (data.method === "POST") await updateEmail(mesg, sessionID, { inputData: data.body })
          break;
        case "/user.updatePassword":
          if (data.method === "POST") await updatePassword(mesg, sessionID, { inputData: data.body })
          break;
        case "/user.sendEmailVerification":
          if (data.method === "POST") await sendEmailVerification(mesg, sessionID, { inputData: data.body })
          break;
        case "/user.verifyEmail":
          if (data.method === "GET") await verifyEmail(mesg, sessionID, { inputData: data.qs })
          break;

        default:
          break;
      }
    } catch (err) {
      error('error while responding api request:', err)
    }
  })
  .on('error', (err) => {
    error('error while listening api requests:', err)
    process.exit(1)
  })
