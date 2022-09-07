/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
    decodeURIComponent(search)
      .replace(/"/g, '\\"')
      .replace(/&/g, '","')
      .replace(/=/g, '":"')
      .replace(/\+/g, ' ') +
    '"}'
  )
}

/**
* @description: 图片压缩
*/
export function ImageCompressorFn(file) {
  let disposeFile = file
  if (Object.prototype.toString.call(file) === '[object Blob]') {
    disposeFile = new File([file], file.name, { type: file.type })
  }
  const read = new FileReader()
  const fileSize = parseFloat(parseInt(disposeFile['size']) / 1024 / 1024).toFixed(2)
  // 小于1m不压缩
  if (fileSize < 1) return file
  read.readAsDataURL(disposeFile)
  return new Promise((resolve, reject) => {
    try {
      read.onload = (e) => {
        const img = new Image()
        img.src = e.target.result
        img.onload = function() {
          const w = Math.floor(this.width / 2)
          const h = Math.floor(this.height / 2)
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          let base64
          canvas.setAttribute('width', w)
          canvas.setAttribute('height', h)
          ctx.drawImage(this, 0, 0, w, h)
          if (fileSize < 1) {
            // 如果图片小于一兆 那么不执行压缩操作
            base64 = canvas.toDataURL(disposeFile['type'], 1)
          } else if (fileSize > 1 && fileSize < 2) {
            // 如果图片大于1M并且小于2M 那么压缩0.5
            base64 = canvas.toDataURL(disposeFile['type'], 0.5)
          } else {
            // 如果图片超过2m 那么压缩0.2
            base64 = canvas.toDataURL(disposeFile['type'], 0.2)
          }
          resolve(dataURLtoFile(base64, disposeFile.name))
        }
      }
    } catch (error) {
      reject(disposeFile)
    }
  })
}
/**
 * @description: 将base64编码转回file文件
 */
const dataURLtoFile = function(dataurl, fileName) {
  var arr = dataurl.split(',')
  var mime = arr[0].match(/:(.*?);/)[1]
  var bstr = atob(arr[1])
  var n = bstr.length
  var u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], fileName, {
    type: mime
  })
}
