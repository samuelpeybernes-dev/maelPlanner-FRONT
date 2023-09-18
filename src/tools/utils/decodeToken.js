import jwt from 'jsonwebtoken'

const decodeToken = token => {
  return jwt.verify(token, process.env.pubtoken, { algorithms: ['RS256'] }, (err, payload) => {
    if (err) return err
    return payload.sub
  })
}

export default decodeToken
