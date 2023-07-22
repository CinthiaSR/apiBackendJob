import Phase from "../models/phase.model";
import User from "../models/user.model";
import jobVacancy from "../models/jobvacancy.model";
import Company from "../models/company.model";
import jwtServices from "../../services/jwt.services";
import { notificationPhaseEmailUser } from "../lib/nodeMailer";
export class phaseController {
  getAllPhase = async (req, res, next) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      await Phase.paginate({}, req.body, (err, docs) => {
        res.send({
          item: docs,
        });
      });
      // const infoPhase=await Phase.find({}).populate('username').populate('vacancy').populate('companyName')
      // res.status(201).send(infoPhase)
    } catch (error) {
      next(error);
    }
  };
  getAllUserInPhaseByVacancie = async (req, res, next) => {
    try {
      const { phase, vacancy, page = 1, limit = 10 } = req.query;
      const filter = {};
      const options = {
        page,
        limit,
      };
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
  createPhase = async (req, res, next) => {
    try {
      const { name, stage } = req.body;

      const newPhase = new Phase({
        name,
      });
      await newPhase.save();
      res.status(201).json({ message: "Created Ok", newPhase });
    } catch (error) {
      next(error);
    }
  };
  getPhase = async (req, res, next) => {
    try {
      //const { id } = req.params;
      const { phase } = req.query;
      const infoPhase = await Phase.findOne({ name: phase });
      console.log("infoPase:..", infoPhase);
      if (!infoPhase) {
        return res.status(404).send({ message: "Phase not found!" });
      } else {
        res.status(201).json({ message: "Get Ok", infoPhase });
      }
    } catch (error) {
      console.log("Error Phase:...", error);
      next(error);
    }
  };
  updatePhase = async (req, res, next) => {
    const { phase, idVacancie, idCandidate } = req.query;
    //const { _id } = await jwtServices.verify(tokenCandidate);
    console.log(
      "Iniciando Actualizacion de Phase:..",
      phase,
      idVacancie,
      idCandidate
    );
    try {
      //enviaremos notificacion por correo al candidato de su avance
      const dataUser = await User.findById({_id:idCandidate});
      const resultNotification= await notificationPhaseEmailUser(dataUser,phase);

      const resultFind = await Phase.findOne({ name: phase });
      const dataVacancies = resultFind?.vacancies;
      console.log("dataVacancies:..", dataVacancies);
      const findVacancieInPhase = dataVacancies.find(
        (item) => String(item.idVacancie) === idVacancie
      );
      let tempDataVacancies = [...dataVacancies];
      let caso = "ninguno";

      console.log("findVacancieInPhase:..", findVacancieInPhase);
      if (!findVacancieInPhase) {
        caso = "basico";
        tempDataVacancies.push({
          idVacancie: idVacancie,
          applicants: [idCandidate],
        });
      } else {
        caso = "secundario";
        tempDataVacancies = dataVacancies.map((item) => {
          if (String(item.idVacancie) === idVacancie) {
            const tempObj = { ...item };
            let tempArray = [...item.applicants, idCandidate];
            console.log("Nuevo array de datos:..", tempArray);
            tempObj._doc.applicants = [...tempArray];
            return tempObj;
          } else {
            return item;
          }
        });
      }

      const resultUpdate = await Phase.findOneAndUpdate(
        { name: phase },
        { vacancies: tempDataVacancies },
        { new: true }
      );

      const objRes = {
        namePhase: phase,
        idVacancie,
        idCandidate,
        resultFind,
        dataVacancies,
        resultUpdate,
        caso,
        tempDataVacancies,
        resultNotification
      };
      /*
        const {id}=req.params;
        const bodyParams={...req.body};
        const infoPhase= await Phase.findByIdAndUpdate(id,bodyParams,{new:true})
        if(!infoPhase){
            return res.status(404).send({message:'Phase not found!'})
        }else{
            res.status(201).json({message:'Updated Ok',infoPhase})
        }*/
      res.status(200).json(objRes);
    } catch (error) {
      console.log("Error UpdatePhase:...", error);
      next(error);
    }
  };
  updatePanel = async (req, res, next) => {
    try {
      const {
        idVacancie,
        listIdsApplicantsPhase1,
        listIdsApplicantsPhase2,
        listIdsApplicantsPhase3,
        listIdsApplicantsPhase4,
      } = req.body;
      const phases = ["Llamada", "Entrevista", "Pruebas", "Contratado"];
      const listas = [
        listIdsApplicantsPhase1,
        listIdsApplicantsPhase2,
        listIdsApplicantsPhase3,
        listIdsApplicantsPhase4,
      ];
      //Notificaremos a los Candidatos su avance 
      

      for (const phase of phases) {
        const numList = phases.indexOf(phase);

        //Notificaremos a los usuarios de su avance
        for(let user of listas[numList]){
          const dataUser = await User.findById({_id:user});
          const resultNotification= await notificationPhaseEmailUser(dataUser,phase);
        }
        const resFind = await Phase.findOne({ name: phase });
        let tempVacancies = resFind.vacancies;
        const isExistVacancy = tempVacancies.find(
          (el) => String(el.idVacancie) === idVacancie
        );
        if (isExistVacancy) {
          tempVacancies.forEach((item) => {
            if (String(item.idVacancie) === idVacancie) {
              item.applicants = [...listas[numList]];
            }
          });
        } else {
          tempVacancies = [
            ...tempVacancies,
            { idVacancie: idVacancie, applicants: [...listas[numList]] },
          ];
        }

        await Phase.findOneAndUpdate(
          { name: phase },
          { vacancies: tempVacancies },
          { new: true }
        );
      }

      const objRes = {
        idVacancie,
        listIdsApplicantsPhase1,
        listIdsApplicantsPhase2,
        listIdsApplicantsPhase3,
        listIdsApplicantsPhase4,
      };
      res.status(200).json(objRes);
    } catch (error) {
      console.log("Error UpdatePanel:...", error);
      next(error);
    }
  };
  deletePhase = async (req, res, next) => {
    try {
      const { id } = req.params;
      const infoPhase = await Phase.findByIdAndDelete(id);
      if (!infoPhase) {
        return res.status(404).send({ message: "Phase not found!" });
      } else {
        res.status(204).json({ message: "Deleted!" });
      }
    } catch (error) {
      next(error);
    }
  };
}
export default new phaseController();
