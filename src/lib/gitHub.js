const request = require('request')

module.exports.getUser = function (userName) {
  return new Promise(function (resolve, reject) {
    request({
      url: 'https://api.github.com/users/' + userName,
      headers: {
        'User-Agent': 'gitpair/nodejs'
      },
      json: true
    }, function (err, response, body) {
      if (err || response.statusCode >= 300) {
        return reject(err)
      }

      return resolve({
        name: body.name,
        email: body.email,
        aliases: [body.login]
      })
    })
  })
}
