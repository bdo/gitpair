import request from 'request'

export function getUser (userName) {
  return new Promise((resolve, reject) => {
    request({
      url: `https://api.github.com/users/${userName}`,
      headers: {
        'User-Agent': 'gitpair/nodejs'
      },
      json: true
    }, (err, response, body) => {
      if (err || response.statusCode >= 300) {
        return reject(err)
      }

      return resolve({
        name: body.name,
        email: body.email,
        initials: body.name.split(' ').map((name) => name[0].toUpperCase()),
        githubUsername: body.login
      })
    })
  })
}
