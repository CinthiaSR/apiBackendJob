import jobVacancy from "../models/jobvacancy.model";
import Company from "../models/company.model";
import User from "../models/user.model";
import jwtServices from "../../services/jwt.services";
import fs from "fs";
import { uploadOneFileToBucket } from "../lib/awsLib";
import { mainDir } from "../../..";
import { request } from "http";
import { sendRejectEmail } from "../lib/nodeMailer";

const { AWS_BUCKETNAME } = process.env;
export class jobVacancyController {
  getAllJobVacancy = async (req, res, next) => {
    try {
      const { page, limit } = req.query;

      const query = {};
      const options = {
        page: page,
        limit: limit,
        sort: { createdAt: "asc" },
        populate: "applicants",
        populate: "job_skills",
      };

      await jobVacancy.paginate(query, options, (err, docs) => {
        res.status(200).json({
          item: docs,
        });
      });

      /* const vacancies = await jobVacancy.find({})
                    .populate('applicants')
                    .populate('job_skills')
                    .sort({createAt:'desc'})
                    .skip(skip)
                    .limit(per_page) */
      //res.status(200).send(vacancies)
    } catch (error) {
      next(error);
    }
  };
  createVacancy = async (req, res, next) => {
    let objRes = {};
    try {
      const { token } = req.params;
      const { _id } = await jwtServices.verify(token);

      // ----------------------------------- ADD AVATAR_URL
      const {
        username,
        companyName,
        avatar_url,
        title,
        type,
        mode,
        city,
        salary,
        activities,
        status,
        job_skills,
      } = req.body;
      const bodyParams = { ...req.body, username: _id };
      console.log("bodyParams:..", bodyParams);
      const file = req?.files?.image;
      objRes = {
        bodyParams,
        file,
      };
      const newVacancy = new jobVacancy({
        ...bodyParams,
      });
      await newVacancy.save();
      const user = await User.findById({ _id: _id });
      user.company_names.push(newVacancy);
      await user.save({ validateBeforeSave: false });
      // res.status(201).json({message:'Create Ok',newVacancy});
      // const {} = newVacancy;
      const id = newVacancy._id;
      console.log("id vacancy", id);
      if (file) {
        const responseUploadFile = await uploadOneFileToBucket(file, id);
        if (responseUploadFile) {
          bodyParams.avatar_url = `https://${AWS_BUCKETNAME}.s3.amazonaws.com/${id}/${file.name}`;
          const updatedVacancy = await jobVacancy.findByIdAndUpdate(
            { _id: id },
            { ...bodyParams },
            { new: true }
          );

          if (updatedVacancy) {
            res.status(201).json({ message: "Created Ok", updatedVacancy });
          } else {
            res.status(404).send({ message: "Not Created!" });
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
        console.log("Falto imagen", file);
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
  getVacancy = async (req, res, next) => {
    try {
      const { id } = req.params;
      const infoVacancy = await jobVacancy
        .findById(id)
        .populate("applicants")
        .populate("job_skills");
      if (!infoVacancy) {
        return res.status(404).send({ message: "Vacancy not found!" });
      }
      res.status(201).send({ infoVacancy });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
  //actualiza el dataVacancy
  updateVacancy = async (req, res, next) => {
    let objRes = {};
    try {
      const { id } = req.params;
      const bodyParams = { ...req.body };
      console.log("id:..", id);
      console.log("bodyparams:..", bodyParams);
      const { token, deleteApplicant } = bodyParams;
      if (token) {
        const { _id } = await jwtServices.verify(bodyParams.token);
        const retriveDataVacancie = await jobVacancy.findById(id);
        //este caso es cuando se agrega un id al array de applicants
        if (!deleteApplicant) {
          if (retriveDataVacancie?.applicants) {
            bodyParams.applicants = [...retriveDataVacancie.applicants, _id];
          } else {
            bodyParams.applicants = [_id];
          }
          delete bodyParams.token;
        }
        //este es el caso cuando se elimina un id del array de applicants
        if (deleteApplicant) {
          if (retriveDataVacancie?.applicants) {
            bodyParams.applicants = retriveDataVacancie.applicants.filter(
              (item) => item._id !== _id
            );
          }
          delete bodyParams.token;
        }
      }

      // -------------------------------------- update Image
      const file = req?.files?.image;
      objRes = {
        bodyParams,
        file,
      };
      if (file) {
        const responseUploadFile = await uploadOneFileToBucket(file, id);
        console.log("responseUploadFile:..", responseUploadFile);
        if (responseUploadFile) {
          bodyParams.avatar_url = `https://${AWS_BUCKETNAME}.s3.amazonaws.com/${id}/${file.name}`;
          const updateVacancy = await jobVacancy.findByIdAndUpdate(
            id,
            bodyParams,
            { new: true }
          );
          if (!updateVacancy) {
            res.status(404).send({ message: "Vacancy not found" });
          } else {
            res.status(201).json({ message: "Updated!", updateVacancy });
          }
          fs.unlink(`${mainDir}/${file.tempFilePath}`, function (err) {
            if (err) {
              console.log(err);
            } else {
              console.log("Successfully deleted the file!");
            }
          });
        }
      } else {
        const updateVacancy = await jobVacancy.findByIdAndUpdate(
          id,
          bodyParams,
          { new: true }
        );
        if (!updateVacancy) {
          res.status(404).send({ message: "Vacancy not found" });
        } else {
          res.status(201).json({ message: "Updated!", updateVacancy });
        }
      }
      // -------------------------- end image
      //     const infoVacancy=await jobVacancy.findByIdAndUpdate(id,bodyParams,{new:true})
      //     if(!infoVacancy){
      //         return res.status(404).send({message:'Vacancy not found!'})
      //     }
      //     res.status(201).send(infoVacancy)
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
  updateListApplicantsInVacancie = async (req, res, next) => {
    const { idCandidate, idVacancy, emailUser } = req.body;
    console.log('emailUser:..',emailUser);
    try {
      
       const result = await jobVacancy.findByIdAndUpdate(
          { _id: idVacancy },
          {
            $pull: { applicants: idCandidate },
            $addToSet: { rejecteds: idCandidate },
          },
          { new: true }
        )
      const updateUserMyVacancies= await User.findByIdAndUpdate(
        {_id:idCandidate},
        {
          $pull: { my_vacancies: idVacancy },
        },
        { new: true }
      )
       sendRejectEmail(emailUser);
      //console.log('resultUpdate (jobVacancyController):..',{result,updateUserMyVacancies});
      res.status(200).json({result,updateUserMyVacancies});
    } catch (error) {
      console.log('Error en JobVacancy:..',error);
      next(error);
    }
  };

  deleteVacancy = async (req, res, next) => {
    try {
      const { id } = req.params;
      const infoVacancy = await jobVacancy.findByIdAndDelete(id);
      if (!infoVacancy) {
        return res.status(404).send({ message: "Vacancy not found!" });
      }
      res.status(204).send({ message: "Deleted!" });
    } catch (error) {
      next(error);
    }
  };
}
export default new jobVacancyController();
