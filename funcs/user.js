const {
  response,
} = require('./http-server')
const bcrypt = require('bcrypt');
const uuidv4 = require('uuid/v4');
const saltRounds = 10;
const SENDGRID_APIKEY = process.env.SENDGRID_APIKEY || ""
const ADDRESS = process.env.ADDRESS || "localhost:2300"

exports.createUser = async (mesg, sessionID, data) => {
  let inputData = JSON.parse(data.inputData);
  let password = await bcrypt.hash(inputData.password, saltRounds)

  const result = await mesg.executeTaskAndWaitResult({
    serviceID: 'mongodb',
    taskKey: 'write',
    inputData: JSON.stringify({
      collectionName: "users",
      saveObject: {
        email: inputData.email,
        emailVerify: false,
        password: password,
        profile: inputData.profile,
        createdDate: new Date()
      }
    })
  })
  return await response(mesg, { sessionID, data: JSON.parse(result.outputData).services })
}


exports.updateProfile = async (mesg, sessionID, data) => {
  let inputData = JSON.parse(data.inputData);
  const result = await mesg.executeTaskAndWaitResult({
    serviceID: 'mongodb',
    taskKey: 'read',
    inputData: JSON.stringify({
      collectionName: "users",
      findObject: {
        email: inputData.email
      }
    })
  })
  let userData = JSON.parse(result.outputData)
  if (userData.data.length > 0) {
    let passwordVerify = await bcrypt.compare(inputData.password, userData.data[0].password)
    if (passwordVerify) {
      let email = inputData.email
      delete inputData.email
      const result = await mesg.executeTaskAndWaitResult({
        serviceID: 'mongodb',
        taskKey: 'update',
        inputData: JSON.stringify({
          collectionName: "users",
          findObject: {
            email: email
          },
          updateObject: {
            profile: inputData.profile,
            updateDate: new Date()
          }
        })
      })
      return await response(mesg, { sessionID, data: JSON.parse(result.outputData) })
    }
    else {
      return await response(mesg, { sessionID, code: 401 })
    }
  } else {
    return await response(mesg, { sessionID, code: 400 })
  }
}



exports.updateEmail = async (mesg, sessionID, data) => {
  let inputData = JSON.parse(data.inputData);
  const result = await mesg.executeTaskAndWaitResult({
    serviceID: 'mongodb',
    taskKey: 'read',
    inputData: JSON.stringify({
      collectionName: "users",
      findObject: {
        email: inputData.email
      }
    })
  })
  let userData = JSON.parse(result.outputData)
  if (userData.data.length > 0) {
    let passwordVerify = await bcrypt.compare(inputData.password, userData.data[0].password)
    if (passwordVerify) {

      const result = await mesg.executeTaskAndWaitResult({
        serviceID: 'mongodb',
        taskKey: 'update',
        inputData: JSON.stringify({
          collectionName: "users",
          findObject: {
            email: inputData.email
          },
          updateObject: {
            email: inputData.newEmail,
            emailVerify: false,
            updateDate: new Date()
          }
        })
      });
      return await response(mesg, { sessionID, data: JSON.parse(result.outputData) })
    } else {
      return await response(mesg, { sessionID, code: 401 })
    }
  } else {
    return await response(mesg, { sessionID, code: 400 })
  }
}


exports.updatePassword = async (mesg, sessionID, data) => {
  let inputData = JSON.parse(data.inputData);
  const result = await mesg.executeTaskAndWaitResult({
    serviceID: 'mongodb',
    taskKey: 'read',
    inputData: JSON.stringify({
      collectionName: "users",
      findObject: {
        email: inputData.email
      }
    })
  })
  let userData = JSON.parse(result.outputData)
  if (userData.data.length > 0) {
    let passwordVerify = await bcrypt.compare(inputData.password, userData.data[0].password)
    if (passwordVerify) {
      const result = await mesg.executeTaskAndWaitResult({
        serviceID: 'mongodb',
        taskKey: 'update',
        inputData: JSON.stringify({
          collectionName: "users",
          findObject: {
            email: inputData.email
          },
          updateObject: {
            password: await bcrypt.hash(inputData.newPassword, saltRounds),
            updateDate: new Date()
          }
        })
      });
      return await response(mesg, { sessionID, data: JSON.parse(result.outputData) })
    } else {
      return await response(mesg, { sessionID, code: 401 })
    }
  } else {
    return await response(mesg, { sessionID, code: 400 })
  }
}


exports.sendEmailVerification = async (mesg, sessionID, data) => {
  let inputData = JSON.parse(data.inputData);
  const result = await mesg.executeTaskAndWaitResult({
    serviceID: 'mongodb',
    taskKey: 'read',
    inputData: JSON.stringify({
      collectionName: "users",
      findObject: {
        email: inputData.email
      }
    })
  })
  let userData = JSON.parse(result.outputData)
  if (userData.data.length > 0 && !userData.data[0].emailVerify) {
    let uuid = uuidv4();
    await mesg.executeTaskAndWaitResult({
      serviceID: 'email-sendgrid',
      taskKey: 'send',
      inputData: JSON.stringify({
        apiKey: SENDGRID_APIKEY,
        from: "supicoyum@mailprotech.com",
        to: userData.data[0].email,
        subject: "MESG Email Verify",
        html: `Please click here to confirm your e-mail address: <a href='http://${ADDRESS}/user.verifyEmail?code=${uuid}'>http://localhost:2300/user.verifyEmail?code=${uuid}</a>`
      })
    });
    const result = await mesg.executeTaskAndWaitResult({
      serviceID: 'mongodb',
      taskKey: 'update',
      inputData: JSON.stringify({
        collectionName: "users",
        findObject: {
          email: inputData.email
        },
        updateObject: {
          emailCode: uuid
        }
      })
    });
    return await response(mesg, { sessionID, data: JSON.parse(result.outputData) })
  } else {
    return await response(mesg, { sessionID, code: 400 })
  }
}



exports.verifyEmail = async (mesg, sessionID, data) => {
  let inputData = JSON.parse(data.inputData);
  const result = await mesg.executeTaskAndWaitResult({
    serviceID: 'mongodb',
    taskKey: 'read',
    inputData: JSON.stringify({
      collectionName: "users",
      findObject: {
        emailCode: inputData.code
      }
    })
  })
  let userData = JSON.parse(result.outputData)
  if (userData.data.length > 0 && !userData.data[0].emailVerify) {
    const result = await mesg.executeTaskAndWaitResult({
      serviceID: 'mongodb',
      taskKey: 'update',
      inputData: JSON.stringify({
        collectionName: "users",
        findObject: {
          email: userData.data[0].email
        },
        updateObject: {
          emailVerify: true,
          verifyDate: new Date()
        }
      })
    });
    return await response(mesg, { sessionID, data: JSON.parse(result.outputData) })
  } else {
    return await response(mesg, { sessionID, code: 400 })
  }
}

