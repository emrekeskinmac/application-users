
exports.listenRequests = (mesg) => {
  return mesg.listenEvent({
    serviceID: 'http-server',
    eventFilter: 'request'
  })
}

exports.response = async (mesg, data) => {
  return await mesg.executeTaskAndWaitResult({
    serviceID: 'http-server',
    taskKey: 'completeSession',
    inputData: JSON.stringify(data)
  })
}
