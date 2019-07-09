function starsToArray(stars) {
  const arr = [];
  const num = stars.substring(0, 1);
  for (let i  = 0; i <5; i++) {
    if (i <= num) {
      arr.push(1)
    } else {
      arr.push(0)
    }
  }
  return arr;
}

function http(url, method, callback) {
  wx.request({
    url: url,
    method: method,
    header: {
      "Content-Type": "json"
    },
    success: function(res) {
      callback(res.data)
    },
    fail: function(res) {
      console.log(res)
    }

  })
}

function convertToCastString(casts) {
  let castString = ''
  for (let key in casts) {
    castString = castString + casts[key].name + '/'
  }
  return castString.substring(0, castString.length - 1);
}

function convertToCastInfo(casts) {
  const castArray = []
  for (let idx in casts) {
    let castObj = {
      img: casts[idx].avatars ? casts[idx].avatars.large : '',
      name: casts[idx].name
    }
    castArray.push(castObj)
  }
  return castArray;
}

module.exports = {
  starsToArray: starsToArray,
  http: http,
  convertToCastString: convertToCastString,
  convertToCastInfo: convertToCastInfo
}