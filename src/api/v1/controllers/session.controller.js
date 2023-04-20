
import bcrypt from 'bcrypt'
import User from '../models/user.model'
// import RefreshToken from '../models/refreshToken'
import JwtServices from '../../services/jwt.services'
import CustomErrorHandler from '../../services/CustomErrorHandler'
import { AuthErrorHandler } from '../../middlewares/auth'


export class SessionController {
  login=async(request, response, next)=>{
    try {
      const { email, password } = request.body
      // check if email exists
      const user = await User.findOne({ email })
      if (!user) {
        return next(AuthErrorHandler.wrongCredentials())
      }
      // compare password
      const match = await bcrypt.compare(password, user.password)
      if (!match) {
        return next(AuthErrorHandler.wrongCredentials())
      }
      const accessToken = JwtServices.sign({ _id: user._id, role: user.role, email: user.email });
      // const refreshToken = JwtServices.sign({ _id: user._id, role: user.role }, '1y', REFRESH_SECRET);
      // await RefreshToken.create({ token: refreshToken })
      response.status(201).send({ access_token: accessToken })
    } catch (error) {
      next(error)
    }
  }
  

  logout(request, response) {
    response.json({ message: 'Logout Controller' })
  }
}

export default new SessionController()