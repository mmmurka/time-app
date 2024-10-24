import moment from 'moment'

function startInterval() {
  setInterval(() => {
    this.currentTime = moment().format('HH:mm:ss')
  }, 1000)
}

export { startInterval }
