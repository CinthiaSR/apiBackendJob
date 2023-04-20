
import bcrypt from 'bcrypt'
import User from '../models/user.model'
import jwtServices from '../../services/jwt.services'
// import JwtServices from '../../services/jwt.services'
import CustomErrorHandler from '../../services/CustomErrorHandler'
import { AuthErrorHandler } from '../../middlewares/auth'
import RefreshToken from '../models/refreshToken'


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
      const accessToken = jwtServices.sign({ _id: user._id, role: user.role, email: user.email });
      const refreshToken = jwtServices.sign({ _id: user._id, role: user.role }, '1y', process.env.REFRESH_TOKEN);
      await RefreshToken.create({ token: refreshToken })
      response.status(201).send({ access_token: accessToken,
                                 refresh_token: refreshToken })
    } catch (error) {
      next(error)
    }
  }
  

  logout=async(request, response)=>{
    try {
      const { refresh_token } = request.body
  
      await RefreshToken.deleteOne({ token: refresh_token })
  
      response.status(200).send({ message: 'Good bye' })
    } catch (error) {
      return next(new Error('Something went wrong in the database'))
    }
    // response.json({ message: 'Logout' })
  }
}

export default new SessionController()