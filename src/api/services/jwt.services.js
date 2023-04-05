import jwt from 'jsonwebtoken'

class JwtServices {
    sign(
      payload, expiry = '2h',
      secret = process.env.JWT_SECRET
    ) {
      return jwt.sign(
        payload,
        secret,
        { expiresIn: expiry }
      )
    }

    verify(
      token,
      secret = process.env.JWT_SECRET
    ) {
      return jwt.verify(token, secret)
    }
}

export default new JwtServices()
