const Application = require('../models/Application');
const { sendStatusUpdateEmail } = require('../services/emailService');

// Get all applications
const getApplications = async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications', error });
  }
};

// Get single application
const getApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ message: 'Application not found' });
    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching application', error });
  }
};

// Create application
const createApplication = async (req, res) => {
  try {
    const { company, role, jobUrl, notes } = req.body;
    const application = new Application({ company, role, jobUrl, notes });
    await application.save();
    res.status(201).json(application);
  } catch (error) {
    res.status(400).json({ message: 'Error creating application', error });
  }
};

// Update application status
const updateApplication = async (req, res) => {
  try {
    const previous = await Application.findById(req.params.id);
    if (!previous) return res.status(404).json({ message: 'Application not found' });

    // Manually assign each field
    if (req.body.company) previous.company = req.body.company;
    if (req.body.role) previous.role = req.body.role;
    if (req.body.status) previous.status = req.body.status;
    if (req.body.jobUrl !== undefined) previous.jobUrl = req.body.jobUrl;
    if (req.body.notes !== undefined) previous.notes = req.body.notes;

    if (req.body.interview) {
      previous.interview = req.body.interview;
    }
 
    if (req.body.offer) {
      previous.offer = req.body.offer;
    }

    const updated = await previous.save();

    // Fire email if status changed
    if (req.body.status && req.body.status !== previous.status) {
      await sendStatusUpdateEmail(updated);
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Error updating application', error: error.message });
  }
};

// Delete application
const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);
    if (!application) return res.status(404).json({ message: 'Application not found' });
    res.status(200).json({ message: 'Application deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting application', error });
  }
};

module.exports = {
  getApplications,
  getApplication,
  createApplication,
  updateApplication,
  deleteApplication
};