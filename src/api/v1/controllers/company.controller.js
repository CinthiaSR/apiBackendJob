import Company from "../models/company.model";
import User from "../models/user.model";
export class CompanyController {
  getAllCompany = async (req, res, next) => {
    try {
      const {page=1,limit=10}=req.query;
      await Company.paginate({},req.body,(err,docs)=>{
        res.send({
          items:docs
        })
      })
      // const infoCompanies = await Company.find()
      // .populate('username');
      res.status(201).send(infoCompanies);
    } catch (error) {
      next(error);
    }
  };
  createCompany = async (req, res, next) => {
    try {
      const { username, company_name,  description } = req.body;
      const newCompany = new Company({
        username,
        company_name,
        rfc,
        description,
      });
      await newCompany.save();
      const user = await User.findById({ _id: newCompany.username });
      user.company_names.push(newCompany);
      await user.save({ validateBeforeSave: false });
      res.status(201).json({message:'Create Ok',newCompany});
    } catch (error) {
      next(error);
    }
  };
  getCompany=async(req,res,next)=>{
    try {
        const {id}=req.params
        const infoCompany=await Company.findById(id).populate('username')
        // const lastInfoCompany=await Company.find(infoCompany).populate('username')
        if(!infoCompany){
            return res.status(404).send({message:'Company not found'})
        }else{
          res.status(200).json({message:'Get Company ok',infoCompany})
        }
    } catch (error) {
        next(error)
    }
  }
  updateCompany=async(req,res,next)=>{
    try {
        const {id}=req.params
        const bodyParams={...req.body}
        const infoCompany= await Company.findByIdAndUpdate(id,bodyParams, {new:true})
        if(!infoCompany){
            return res.status(404).send({message:'Company not found!'})
        }else{
          res.status(201).json({message:'Get ok',infoCompany})
        }
    } catch (error) {
        next(error)
    }
  }
  deleteCompany= async(req,res,next)=>{
    try {
        const {id}=req.params
        const infoCompany=await Company.findByIdAndDelete(id)
        if(!infoCompany){
            return res.status(404).send({message:'Company not found!'})
        }else{
          res.status(204).send({message:'Deleted!'})
        }
    } catch (error) {
        next(error)
    }
  }
}
export default new CompanyController();
