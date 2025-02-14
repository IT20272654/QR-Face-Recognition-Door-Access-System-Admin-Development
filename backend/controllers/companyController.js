const Company = require('../models/Company');

// Fetch all companies
const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Fetch all companies with their admins
const getCompaniesWithAdmins = async (req, res) => {
  try {
    const companies = await Company.find().populate('admins', '-password');
    res.json(companies);
  } catch (error) {
    console.error('Error fetching companies with admins:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Fetch a company by ID
const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id).populate('admins', '-password');
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    res.json(company);
  } catch (error) {
    console.error('Error fetching company by ID:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update a company
const updateCompany = async (req, res) => {
  const { name, address } = req.body;
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    company.name = name;
    company.address = address;
    await company.save();
    res.json(company);
  } catch (error) {
    console.error('Error updating company:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


// Check if company name and address combination is unique
const checkCompanyNameAndAddressUnique = async (req, res) => {
  const { name, address, companyId } = req.query;
  // console.log(`Checking uniqueness for name: ${name}, address: ${address}, companyId: ${companyId}`);
  try {
    const company = await Company.findOne({ name, address });
    if (company && company._id.toString() !== companyId) {
      // console.log('Company name and address combination is not unique');
      return res.json({ isUnique: false });
    }
    // console.log('Company name and address combination is unique');
    res.json({ isUnique: true });
  } catch (error) {
    // console.error('Error checking company name and address uniqueness:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a company
const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    await Company.deleteOne({ _id: req.params.id });
    res.json({ message: 'Company deleted successfully' });
  } catch (error) {
    console.error('Error deleting company:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Add a location to a company
const addLocation = async (req, res) => {
  const { companyId, location } = req.body;
  try {
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    company.locations.push(location);
    await company.save();
    res.status(200).json({ message: 'Location added successfully', company });
  } catch (error) {
    console.error('Error adding location:', error);
    res.status(500).json({ message: 'Error adding location', error });
  }
};

// Delete a location from a company
const deleteLocation = async (req, res) => {
  const { companyId, location } = req.body;
  
  try {
    const company = await Company.findByIdAndUpdate(
      companyId,
      { $pull: { locations: location } },
      { new: true }
    );

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.status(200).json({ 
      message: 'Location deleted successfully',
      company
    });
    
  } catch (error) {
    console.error('Error deleting location:', error);
    res.status(500).json({ 
      message: 'Error deleting location', 
      error: error.message 
    });
  }
};

module.exports = { getCompaniesWithAdmins, getCompanies, getCompanyById, updateCompany, deleteCompany, checkCompanyNameAndAddressUnique, addLocation, deleteLocation};