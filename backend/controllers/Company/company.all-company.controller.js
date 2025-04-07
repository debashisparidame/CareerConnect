const CompanySchema = require("../../models/company.model");


const AddCompany = async (req, res) => {
  try {
    const companyName = req.body.companyName;
    const companyDescription = req.body.companyDescription;
    const companyWebsite = req.body.companyWebsite;
    const companyLocation = req.body.companyLocation;
    const companyDifficulty = req.body.companyDifficulty;

    if (await CompanySchema.findOne({ companyName: companyName })) {
      return res.status(400).json({ msg: "Company Name Already Exist!" })
    }

    const newcmp = new CompanySchema({
      companyName,
      companyDescription,
      companyWebsite,
      companyLocation,
      companyDifficulty
    });

    await newcmp.save();

    return res.status(201).json({ msg: "Company Created Successfully!", });
  } catch (error) {
    console.log("company.all-company.controller.js = AddCompany => ", error);
    return res.status(500).json({ msg: 'Server Error' });
  }
}

const UpdateCompany = async (req, res) => {
  try {
    const companyId = req.query.companyId;
    if (!companyId) return res.status(404).json({ msg: "Company Not Found!" });

    const { companyName, companyDescription, companyWebsite, companyLocation, companyDifficulty } = req.body;

    const company = await CompanySchema.findById(companyId);

    // Update only the fields that are provided in the request body
    company.companyName = companyName || company.companyName;
    company.companyDescription = companyDescription || company.companyDescription;
    company.companyWebsite = companyWebsite || company.companyWebsite;
    company.companyLocation = companyLocation || company.companyLocation;
    company.companyDifficulty = companyDifficulty || company.companyDifficulty;

    await company.save();

    return res.status(201).json({ msg: "Company Details Updated!", });
  } catch (error) {
    console.log("company.all-company.controller.js = AddCompany => ", error);
    return res.status(500).json({ msg: 'Server Error' });
  }
}


const CompanyDetail = async (req, res) => {
  try {
    if (req.query.companyId) {
      const company = await CompanySchema.findById(req.query.companyId);
      return res.json({ company });
    }
  } catch (error) {
    console.log("company.all-company.controller.js = CompanyDetail => ", error);
    return res.status(500).json({ msg: 'Server Error' });
  }
}

const AllCompanyDetail = async (req, res) => {
  try {
    const companys = await CompanySchema.find();
    // console.log(companys)
    return res.json({ companys });
  } catch (error) {
    console.log("company.all-company.controller.js = AllCompanyDetail => ", error);
    return res.status(500).json({ msg: 'Server Error' });
  }
}

const DeleteCompany = async (req, res) => {
  try {
    // await CompanySchema.findByIdAndDelete(req.body.companyId);
    const company = await CompanySchema.findById(req.body.companyId);
    // company and related jobs removed
    await company.deleteOne();
    return res.json({ msg: "Company Deleted Successfully!" });
  } catch (error) {
    console.log("company.all-company.controller.js = DeleteCompany => ", error);
    return res.status(500).json({ msg: 'Server Error' });
  }
}


module.exports = {
  AddCompany,
  UpdateCompany,
  CompanyDetail,
  AllCompanyDetail,
  DeleteCompany
};