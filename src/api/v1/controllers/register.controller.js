import bcrypt from "bcrypt";
import logger from "../../middlewares/logger";
import User from "../models/user.model";
import jwt from "jsonwebtoken";
import RefreshToken from "../models/refreshToken";
import jwtServices from "../../services/jwt.services";
import { getRandomInt } from "../lib/helperLib";

import MailService from "@sendgrid/mail";
import { sendCodeEmail } from "../lib/nodeMailer";

export class RegisterController {
  createAccount = async (req, res, next) => {
    try {
      const { email, password, rfc } = req.body || "";
      const { role } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const register_user = new User({
        email,
        role,
        password: hashedPassword,
        emailToken: jwt.sign(
          { foo: "bar", iat: Math.floor(Date.now() / 1000) - 30 },
          "shhhhh"
        ),
        isVerified: false,
      });

      await register_user.save();
      //res.status(201).json({message:'Candidato creado!'})
      // res.status(201).send(emailToken)

      const accessToken = jwtServices.sign({
        _id: register_user._id,
        role: register_user.role,
        email: register_user.email,
      });
      const refreshToken = jwtServices.sign(
        { _id: register_user._id, role: register_user.role },
        "1y",
        process.env.REFRESH_TOKEN
      );
      await RefreshToken.create({ token: refreshToken });
      let tempUser = { ...register_user._doc, accessToken };
      delete tempUser._id;
      delete tempUser.password;
      res.status(201).json({ ...tempUser });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  createAccountByCompany = async (req, res, next) => {
    try {
      const { email, password, role, rfc } = req.body || "";
      const hashedPassword = await bcrypt.hash(password, 10);
      const register_user = new User({
        email,
        role,
        rfc,
        password: hashedPassword,
        emailToken: jwt.sign(
          { foo: "bar", iat: Math.floor(Date.now() / 1000) - 30 },
          "shhhhh"
        ),
        isVerified: false,
      });

      await register_user.save();
      res.status(201).send({ message: "Reclutador creado" });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  sendAccesCode = async (req, res, next) => {
    const dataLogin = req.body;
    console.log('dataLogin:..',dataLogin);
    let objRes = {
      msg: "Enviando AccessCode al email del usuario:..",
    };
    try {
      const code = getRandomInt(123456, 999999);
      const resultSendCode = await sendCodeEmail({
        code,
        email: dataLogin.email,
      });
      objRes = {
        ...objRes,
        code,
        dataLogin,
        resultSendCode,
      };
      res.status(200).json(objRes);
    } catch (error) {
      res.status(500).json(error);
    }
  };

  verificationEmail = async (req, res, next) => {
    try {
      const { token } = req.params;
      const bodyParams = {
        emailToken: token,
        isVerified: true,
      };
      const user = await User.findOneAndUpdate(token, bodyParams, {
        new: true,
      });
      if (!user) {
        return res.status(404).send({ message: "token invalid" });
      }
      user.emailToken = null;
      user.isVerified = true;
      await user.save();
      res.status(201).send(user);
    } catch (error) {
      next(error);
    }
  };
}
export default new RegisterController();
