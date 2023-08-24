import User from "../models/user.model";
import jwtServices from "../../services/jwt.services";
import fs from "fs";
import { uploadOneFileToBucket } from "../lib/awsLib";
import { mainDir } from "../../..";
import bcrypt from "bcrypt";

const { AWS_BUCKETNAME } = process.env;

export class UserController {
  getAllUser = async (req, res, next) => {
    console.log("Recuperando datos de los usuarios:..");
    try {
      const { page, limit } = req.query;
      const query = {};
      const options = {
        page: page,
        limit: limit,
        sort: { createdAt: "desc" },
      };
      await User.paginate(query, options, (err, docs) => {
        console.log(docs);
        res.send({
          item: docs,
        });
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
  getAllUserOutPaginate=async(req,res,next)=>{
    try {
        const getUser=await User.find({})
        res.status(201).json(getUser)
    } catch (error) {
        next(error)
    }
}
  getAllUsersInVacancy = async (req, res, next) => {
    try {
      const { id } = req.params;
      console.log("idVacancie:..", id);
      const { page, limit } = req.query;

      const query = {
        my_vacancies: `${id}`,
      };
      const options = {
        page: page,
        limit: limit,
        sort: { createdAt: "asc" },
        populate: "user_skills",
      };

      await User.paginate(query, options, (err, docs) => {
        console.log(docs);
        res.status(200).send({
          item: docs,
        });
      });
    } catch (error) {
      console.log(error);
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
  getSkillsInUser = async (req, res, next) => {
    try {
      const { token } = req.params;
      const { _id } = await jwtServices.verify(token);
      console.log("dataQuery:..", req.query);

      const user = await User.findById(_id).populate("user_skills");
      if (!user) {
        res.status(404).send({
          error: "No se encontro ningun registro en la base de datos",
        });
      } else {
        delete user._id;
        delete user.password;
        res.status(200).json({ message: "Get User ok", user });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
  getUser = async (req, res, next) => {
    try {
      const { token } = req.params;
      const { _id } = await jwtServices.verify(token);

      const user = await User.findById(_id)
        .populate("phase")
        .populate("company_names")
        .populate("my_vacancies")
        .populate("user_skills")
        .populate("feedback");
      if (!user) {
        res.status(404).send({
          error: "No se encontro ningun registro en la base de datos",
        });
      } else {
        delete user._id;
        delete user.password;
        res.status(200).json({ message: "Get User ok", user });
      }
    } catch (error) {
      next(error);
    }
  };
  getUserById = async (req, res, next) => {
    try {
      const { id } = req.params;
      console.log("Consultando user:..", id);

      const user = await User.findById(id)
        .populate("user_skills")
        .populate("my_vacancies");
      if (!user) {
        res.status(404).send({
          error: "No se encontro ningun registro en la base de datos",
        });
      } else {
        delete user._id;
        delete user.password;
        res.status(200).json({ message: "Get User ok", user });
      }
    } catch (error) {
      next(error);
    }
  };
  getUserByEmail = async (req, res, next) => {
    try {
      const { email } = req.query;
      console.log("Consultando user:..", email);

      const user = await User.findOne({email})
      .populate('my_vacancies')
      if (!user) {
        res.status(404).send({
          error: "No se encontro ningun registro en la base de datos",
        });
      } else {
        delete user._id;
        delete user.password;
        res.status(200).json({ message: "Get User ok", user });
      }
    } catch (error) {
      next(error);
    }
  };
  // aqui se actualiza el perfil del usuario
  updateUser = async (req, res, next) => {
    let objRes = {};
    console.log("Actualizando dataUser(2) PRUEBAS ROR:..", req.body);
    

    //debuging 1
    try {
      const { token } = req.params;
      const { _id, role, password } = await jwtServices.verify(token);
      const bodyParams = { ...req.body };
      const {working_experience}=bodyParams;
      let tempArrarExp=[];
      if(working_experience){
        if(Array.isArray(working_experience)){
          //console.log('tamaño del working_experience...',working_experience.length);
          if(working_experience?.length>0){
            for (let i=0;i<working_experience.length;i++){
              //console.log(`Agregando experiencia (${i}):..`,working_experience[i]);
              tempArrarExp.push(JSON.parse(working_experience[i] ) );
            }
            bodyParams.working_experience=[...tempArrarExp];
          }
        }else{
          if(working_experience!=='none'){
            tempArrarExp.push(JSON.parse(working_experience))
            bodyParams.working_experience=[...tempArrarExp];
          }
          if(working_experience==='none'){
            bodyParams.working_experience=[...tempArrarExp]
          }
          
        }
      }
      const file = req?.files?.image;
      if (bodyParams?.password !== "" && bodyParams?.password !== undefined) {
        const tempPass = bodyParams.password;
        const hashedPassword = await bcrypt.hash(tempPass, 10);
        bodyParams.password = hashedPassword;
      } else {
        bodyParams.password = password;
      }

      objRes = {
        bodyParams,
        file,
      };
      if (file) {
        const responseUploadFile = await uploadOneFileToBucket(file, _id);
        if (responseUploadFile) {
          bodyParams.avatar_url = `https://${AWS_BUCKETNAME}.s3.amazonaws.com/${_id}/${file.name}`;
          const updateUser = await User.findByIdAndUpdate(_id, bodyParams, {
            new: true,
          })
            .populate("my_vacancies")
            .populate("user_skills");
          if (!updateUser) {
            res.status(404).send({ message: "User not found!" });
          } else {
            delete updateUser.password;
            delete updateUser._id;
            res.status(201).json({ message: "Update User Ok", updateUser });
          }
          fs.unlink(`${mainDir}/${file.tempFilePath}`, function (err) {
            if (err) {
              console.log(err);
            } else {
              console.log("Successfully deleted the file.");
            }
          });
        }
      } else {
        const updateUser = await User.findByIdAndUpdate(_id, bodyParams, {
          new: true,
        })
          .populate("my_vacancies")
          .populate("user_skills");
        if (!updateUser) {
          res.status(404).send({ message: "User not found!" });
        } else {
          delete updateUser.password;
          delete updateUser._id;
          res.status(201).json({ message: "Update User Ok", updateUser });
        }
      }
      //res.status(200).json(objRes)
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
  

  updatePassword= async(req,res,next)=>{
    try {
      const dataBody=req.body;
      const {email,password}=dataBody
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await User.findOneAndUpdate({email:email},{password:hashedPassword},{new:true})

      res.status(200).json(result)
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
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
