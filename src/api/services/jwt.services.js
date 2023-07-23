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
      const resultVerify = jwt.verify(token, secret);
      //console.log('resultVerify (jwt.services):..',resultVerify);
      return resultVerify
    }
}

export default new JwtServices()
