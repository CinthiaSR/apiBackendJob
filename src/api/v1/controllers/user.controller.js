import User from "../models/user.model";
import jwtServices from "../../services/jwt.services";
import fs from "fs";
import { uploadOneFileToBucket } from "../lib/awsLib";
import { mainDir } from "../../.."; 
import bcrypt from 'bcrypt'


const { AWS_BUCKETNAME } = process.env;



export class UserController {
  getAllUser = async (req, res, next) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      await User.paginate({}, req.body, (err, docs) => {
        res.send({
          item: docs,
        });
      });
    } catch (error) {
      next(error);
    }
  };
  createUser = async (req, res, next) => {
    try {
      const {
        name,
        last_name,
        avatar_url,
        age,
        gender,
        rfc,
        role,
        bachelor,
        working_experience,
        email,
        password,
      } = req.body;
      const newUser = new User({
        name,
        last_name,
        avatar_url,
        age,
        gender,
        rfc,
        role,
        bachelor,
        working_experience,
        email,
        password,
      });
      await newUser.save();
      res.status(201).json({ message: "Create User Ok", newUser });
      // res.json({message:'Create User Ok'})
    } catch (error) {
      next(error);
    }
  };
  getUser = async (req, res, next) => {
    try {
      const { id } = req.params;

      const user = await User.findById(id)
        .populate("phase")
        .populate("company_names")
        .populate("user_skills")
        .populate("feedback");
      if (!user) {
        res.status(404).send({
          error: "No se encontro ningun registro en la base de datos",
        });
      } else {
        res.status(200).json({ message: "Get User ok", user });
      }
    } catch (error) {
      next(error);
    }
  };
  // aqui se actualiza el perfil del usuario
  updateUser = async (req, res, next) => {
    let objRes = {};
    //console.log('Actualizando dataUser:..',req.body);
    try {
      const { token } = req.params; 
      const { _id, role, password } = await jwtServices.verify(token);
      const bodyParams = { ...req.body };
      const file = req?.files?.image;
      /*objRes={
        token,
        bodyParams
      }
      console.log(objRes);
      res.status(200).json(objRes);*/
      if(bodyParams?.password!==''&&bodyParams?.password!==undefined){
        const tempPass = bodyParams.password;
        const hashedPassword=await bcrypt.hash(tempPass,10)
        bodyParams.password = hashedPassword;
      }else{
        bodyParams.password=password
      }
      
      objRes = {
        bodyParams,
        file,
      };
      //console.log("objRes:..", objRes);
      if (file) {
        const responseUploadFile = await uploadOneFileToBucket(file, _id);
        if (responseUploadFile) {
          bodyParams.avatar_url = `https://${AWS_BUCKETNAME}.s3.amazonaws.com/${_id}/${file.name}`;
          const updateUser = await User.findByIdAndUpdate(_id, bodyParams, {
            new: true,
          });
          if (!updateUser) {
             res.status(404).send({ message: "User not found!" });
          } else {
            res.status(201).json({ message: "Update User Ok", updateUser });
          }
          fs.unlink(`${mainDir}/${file.tempFilePath}`, function(err) {
            if (err) {
               console.log(err);
            } else {
              console.log("Successfully deleted the file.")
            }
          })
        }
      } else {
        const updateUser = await User.findByIdAndUpdate(_id, bodyParams, {
          new: true,
        });
        if (!updateUser) {
           res.status(404).send({ message: "User not found!" });
        } else {
          res.status(201).json({ message: "Update User Ok", updateUser });
        }
      }
      //res.status(200).json(objRes)
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  deleteUser = async (req, res, next) => {
    try {
      const { id } = req.params;
      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) {
        res.status(404).send({
          error: "User not found!",
        });
      } else {
        res.status(204).send({ message: "Deleted!" });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}
export default new UserController();
