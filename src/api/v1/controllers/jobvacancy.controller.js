import jobVacancy from "../models/jobvacancy.model";
import jobSkill from "../models/jobskill.model";
import Company from "../models/company.model";
import User from "../models/user.model";
import jwtServices from "../../services/jwt.services";
import fs from "fs";
import { uploadOneFileToBucket } from "../lib/awsLib";
import { mainDir } from "../../..";
import { request } from "http";
import { sendRejectEmail } from "../lib/nodeMailer";
import { sendMailsCandidatesInVacancy } from "../lib/nodeMailer";

const { AWS_BUCKETNAME } = process.env;
export class jobVacancyController {
  getTitlesVacancies = async (req, res, next) => {
    let objRes = {};
    try {
      const distinctTitles = await jobVacancy.distinct("title");
      let tempDataTitles = [];
      if (distinctTitles) {
        distinctTitles.forEach((item) => {
          const tempItem = item?.toLowerCase().trim();
          const findItem = tempDataTitles.find(
            (el) => el.toLowerCase().trim() === tempItem
          );
          if (!findItem) {
            tempDataTitles.push(item);
          }
        });
      }
      const distinctCompanies = await jobVacancy.distinct("companyName");
      let tempDataCompanies = [];
      if (distinctCompanies) {
        distinctCompanies.forEach((item) => {
          const tempItem = item?.toLowerCase().trim();
          const findItem = tempDataCompanies.find(
            (el) => el.toLowerCase().trim() === tempItem
          );
          if (!findItem) {
            tempDataCompanies.push(item);
          }
        });
      }
      const distinctTypes = await jobVacancy.distinct("type");
      let tempDataTypes = [];
      if (distinctTypes) {
        distinctTypes.forEach((item) => {
          const tempItem = item?.toLowerCase().trim();
          const findItem = tempDataTypes.find(
            (el) => el.toLowerCase().trim() === tempItem
          );
          if (!findItem) {
            tempDataTypes.push(item);
          }
        });
      }
      const distinctModes = await jobVacancy.distinct("mode");
      let tempDataModes = [];
      if (distinctModes) {
        distinctModes.forEach((item) => {
          const tempItem = item?.toLowerCase().trim();
          const findItem = tempDataModes.find(
            (el) => el.toLowerCase().trim() === tempItem
          );
          if (!findItem) {
            tempDataModes.push(item);
          }
        });
      }
      const distinctCities = await jobVacancy.distinct("city");
      let tempDataCities = [];
      if (distinctCities) {
        distinctCities.forEach((item) => {
          const tempItem = item?.toLowerCase().trim();
          const findItem = tempDataCities.find(
            (el) => el.toLowerCase().trim() === tempItem
          );
          if (!findItem) {
            tempDataCities.push(item);
          }
        });
      }
      objRes = {
        distinctCompanies: tempDataCompanies,
        distinctTitles: tempDataTitles,
        distinctTypes: tempDataTypes,
        distinctModes: tempDataModes,
        distinctCities: tempDataCities,
      };
      res.status(200).json(objRes);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
  getDataConsult = async (req, res, next) => {
    const { value, page, limit } = req.query;
    try {

      const query = {
        $or: [
          { title: value },
          { companyName: value },
          { type: value },
          { city: value },
          { mode: value },
        ],
        status:'Iniciado',
      };
      const options = {
        page: page,
        limit: limit,
        sort: { createdAt: "desc" },
        populate: "applicants",
        populate: "job_skills",
        // status:'Iniciado'
      };

      /*
      const resultConsult = await jobVacancy.find({
        $or: [
          { title: value },
          { companyName: value },
          { type: value },
          { city: value },
          { mode: value },
        ],
      });*/
      await jobVacancy.paginate(query, options, (err, docs) => {
        res.status(200).json({
          item: docs,
        });
      });
      //res.status(200).json(resultConsult);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
  getAllJobVacancy = async (req, res, next) => {
    try {
      const { page, limit } = req.query;

      const query = {
        status: "Iniciado",
      };
      const options = {
        page: page,
        limit: limit,
        sort: { createdAt: "desc" },
        populate: ["applicants","job_skills","username","rejecteds"],
        // status:'Iniciado'
      };

      await jobVacancy.paginate(query, options, (err, docs) => {
        if (err) {
          console.log('Error al interior de Paginate:...',err);
        }
        res.status(200).json({
          item: docs,
          msg: "Get All Job Vacancy",
        });
      });
 
    } catch (error) {
      console.log('Error al recuperar las Vacantes:..',error);
      next(error);
    }
  };

  getAllJobVacancyByUser = async (req, res, next) => {
    const { token } = req.params;

    //recuperar las vacantes del reclutador..
    
    try {
      const { _id } = await jwtServices.verify(token);
      console.log('Recuperar las vacantes del reclutador:..',_id);
      const { page, limit } = req.query;
      const query = {
        status: "Iniciado",
        username: _id,
      };
      const dataUser= await User.findById(_id);
      const options = {
        page: page,
        limit: limit,
        sort: { createdAt: "desc" },
        populate: "username",
        populate: "applicants",
        populate: "job_skills",
        populate: "rejecteds",
        // status:'Iniciado'
      };
      const listVacanciesByUser=await jobVacancy.find({username:_id});

      await jobVacancy.paginate(query, options, (err, docs) => {
        res.status(200).json({
          item: docs,
          dataRecrutier:dataUser.email,
          listVacanciesByUser
        });
      });
    } catch (error) {
      console.log("Error al recuperar las vacantes del reclutador:..", error);
      next(error);
    }
  };

  getAllSkillsByVacancy = async (req, res, next) => {
    try {
      const { id } = req.params;
      console.log("idVacancie:..", id);
      const { page, limit } = req.query;

      const infoVacancy = await jobVacancy
        .findById(id)
        .populate("applicants")
        .populate("job_skills");
      if (!infoVacancy) {
        return res.status(404).send({ message: "Vacancy not found!" });
      }

      const { job_skills } = infoVacancy;
      console.log(job_skills);
      // const
      const query = {
        job_skills: `${job_skills}`,
      };
      const options = {
        page: page,
        limit: limit,
        sort: { createdAt: "asc" },
      };

      await jobSkill.paginate(query, options, (err, docs) => {
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
  closeVacancy = async (req, res, next) => {
    let objRes = {};
    try {
      const { idVacancy, listIdsApplicants } = req.body;

      const resultCloseVacancy = await jobVacancy.findByIdAndUpdate(
        { _id: idVacancy },
        { status: "Cerrado" },
        { new: true }
      );
      const dataVacancy = { ...resultCloseVacancy?._doc };
      objRes = {
        idVacancy,
        listIdsApplicants,
        resultCloseVacancy,
      };

      if (listIdsApplicants) {
        let listMailsCandidates = [];
        for (let i = 0; i < listIdsApplicants.length; i++) {
          const dataApplicant = await User.findById(listIdsApplicants[i]);
          if (dataApplicant?.email) {
            listMailsCandidates.push(dataApplicant.email);
          }
        }
        if (listMailsCandidates.length > 0) {
          const stringMails = listMailsCandidates.toString();
          console.log("dataVacancy(enviando datos a NodeMailer):..", dataVacancy);
          const resultSendMails = await sendMailsCandidatesInVacancy(
            stringMails,
            dataVacancy
          );
          objRes = {
            ...objRes,
            listMailsCandidates,
            stringMails,
            resultSendMails,
          };
        }
      }

      res.status(200).json(objRes);
    } catch (error) {
      console.log(error);
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
      let tempArrTask = [];

      if (activities) {
        if (Array.isArray(activities)) {
          for (let task of activities) {
            tempArrTask.push(JSON.parse(task));
          }
          bodyParams.activities = [...tempArrTask];
        } else {
          const newAct = JSON.parse(activities);
          tempArrTask.push(newAct);
          bodyParams.activities = [...tempArrTask];
        }
      }

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
      console.log("datos por vacante", infoVacancy);
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

      console.log("-----------Actualizando PRUEBAS:..idVacancy :..", id);
      console.log("bodyparams:..", bodyParams);
      const { activities } = bodyParams;
      let tempArrarTask = [];

      if (activities) {
        if (Array.isArray(activities)) {
          if (activities?.length > 0) {
            for (let task of activities) {
              tempArrarTask.push(JSON.parse(task));
            }
            bodyParams.activities = [...tempArrarTask];
          }
        } else {
          tempArrarTask.push(JSON.parse(activities));
          bodyParams.activities = [...tempArrarTask];
        }
      }

      const { token, deleteApplicant } = bodyParams;
      if (token) {
        const { _id } = await jwtServices.verify(bodyParams.token);
        const retriveDataVacancie = await jobVacancy.findById(id);
        //este caso es cuando se agrega un id al array de applicants
        if (deleteApplicant===undefined) {
          if (retriveDataVacancie?.applicants) {
            bodyParams.applicants = [...retriveDataVacancie.applicants, _id];
          } else {
            bodyParams.applicants = [_id];
          }
          delete bodyParams.token;
        }
        //este es el caso cuando se elimina un id del array de applicants
        if (deleteApplicant===true) {
          if (retriveDataVacancie?.applicants) {
            bodyParams.applicants = retriveDataVacancie.applicants.filter(
              (item) => String(item._id) !== String(_id)
            );
          }
          delete bodyParams.deleteApplicant;
          delete bodyParams.token;
        }
        console.log("--------(NUEVOS DATOS...)bodyParams:..", bodyParams);
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
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
  updateListApplicantsInVacancie = async (req, res, next) => {
    const { idCandidate, idVacancy, emailUser } = req.body;
    //console.log("emailUser:..", emailUser);
    try {
      const result = await jobVacancy.findByIdAndUpdate(
        { _id: idVacancy },
        {
          $addToSet: { rejecteds: idCandidate },
          $pull: { applicants: idCandidate },
          
        },
        { new: true }
      );
      const findUser = await User.findById({ _id: idCandidate });
      let tempDataPhaseStatus = [];
      if (findUser) {
        if (findUser?.phase_status?.length > 0) {
          tempDataPhaseStatus = [...findUser.phase_status];
          const newPhaseStatus = tempDataPhaseStatus?.filter(
            (el) => String(el.idVacancy) === String(idVacancy)
          );
          tempDataPhaseStatus = [...newPhaseStatus];
        } else {
          tempDataPhaseStatus = [...tempDataPhaseStatus];
        }
      }
      const updateUserMyVacancies = await User.findByIdAndUpdate(
        { _id: idCandidate },
        {
          $pull: { my_vacancies: idVacancy },
          phase_status: [...tempDataPhaseStatus],
        },
        { new: true }
      );
      sendRejectEmail(updateUserMyVacancies, result);
      //console.log('resultUpdate (jobVacancyController):..',{result,updateUserMyVacancies});
      res.status(200).json({ result, updateUserMyVacancies });
    } catch (error) {
      console.log("Error en JobVacancy:..", error);
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
