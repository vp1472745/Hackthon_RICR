
import mongoose from "mongoose";
import Team from "../models/TeamModel.js";
import ProblemStatement from "../models/problemStatementModel.js";
import Admin from "../models/adminRegisterModel.js";
import User from "../models/UserModel.js";
import Theme from "../models/projectTheme.js";
import Payment from "../models/PaymentModel.js";
import bcrypt from "bcrypt";
import { sendOTPEmail } from "../utils/adminemailService.js";
import { sendOTPPhone } from "../utils/adminPhoneService.js";
import Otp from "../models/otpModelAdmin.js";
import jwt from "jsonwebtoken";
import {  sendCredentialsEmail , sendRejectionEmail } from '../utils/emailService.js';

const JWT_SECRET = process.env.JWT_SECRET || "defaultsecret";

export const sendAdminOTP = async (req, res) => {
  try {
    const { email, phone } = req.body;
    if (!email || !phone) {
      return res.status(400).json({ message: "Email and phone are required." });
    } 
    const existingAdmin = await Admin.find({ $or: [{ email }, { phone }] });
    if (existingAdmin.length > 0) {
      return res.status(400).json({ message: "Admin with this email or phone already exists." });
    }
    // Remove any previous OTPs for this email/phone
    await Otp.deleteMany({ email, phone });

    const emailOTP = Math.floor(100000 + Math.random() * 900000).toString();
    const phoneOTP = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
    // Send OTPs to user
    await sendOTPEmail(email, emailOTP);
    await sendOTPPhone(phone.toString(), phoneOTP);

    // Save OTPs to database with expiry
    const otp = new Otp({ email, phone, emailOTP, phoneOTP, expiresAt });
    await otp.save();

    res.status(200).json({ message: "OTPs sent successfully. OTPs are valid for 5 minutes." });
  } catch (error) {
    res.status(500).json({ message: "Failed to send OTPs", error: error.message });
  }
};



export const verifyAdminOTP = async (req, res) => {
  try {
    const { email, phone, emailOTP, phoneOTP } = req.body;
    if (!email || !phone || !emailOTP || !phoneOTP) {
      return res.status(400).json({ message: "Email, phone, emailOTP and phoneOTP are required." });
    }
    const otpRecord = await Otp.findOne({ email, phone });
    if (!otpRecord) {
      return res.status(400).json({ message: "No OTP record found for this email and phone." });
    }
    // Check expiry
    if (otpRecord.expiresAt && otpRecord.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }
    if (otpRecord.emailOTP !== emailOTP || otpRecord.phoneOTP !== phoneOTP) {
      return res.status(400).json({ message: "Invalid OTPs." });
    }
    // OTPs are valid, delete the record
    await Otp.deleteOne({ _id: otpRecord._id });
    res.status(200).json({ message: "OTPs verified successfully." });
  }
  catch (error) {
    res.status(500).json({ message: "Failed to verify OTPs", error: error.message });
  }
};



export const registerAdmin = async (req, res) => {
  try {
    const { username, email, phone, password, role } = req.body;
    if (!username || !email || !phone || !password || !role) {
      return res.status(400).json({ message: "All fields are required." });
    }
    const existingAdmin = await Admin.findOne({ $or: [{ email }, { phone }] });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin with this email or phone already exists." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ username, email, phone, password: hashedPassword, role });
    await newAdmin.save();
    res.status(201).json({ message: "Admin registered successfully", admin: newAdmin });
  } catch (error) {
    res.status(500).json({ message: "Failed to register admin", error: error.message });
  }
};

// Admin login
export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: admin._id, role: admin.role }, JWT_SECRET, {
      expiresIn: "1d",
    });

    // Set the token in an HTTP-only cookie
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({
      message: "Login successful",
      token: token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error during admin login", error: error.message });
  }
};

// Delete admin
export const deleteAdmin = async (req, res) => {
  const { id } = req.params;

  try {
    const admin = await Admin.findByIdAndDelete(id);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    handleError(res, error, "Error deleting admin");
  }
};

//logout admin
export const adminLogout = (req, res) => {
  res.clearCookie("authToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).json({ message: "Logout successful" });
};



// Create a new theme
export const createTheme = async (req, res) => {
  try {
    const { themeName, themeShortDescription, themeDescription } = req.body;
    if (!themeName || !themeShortDescription || !themeDescription) {
      return res.status(400).json({ message: "All theme fields are required." });
    }
    const theme = new Theme({ themeName, themeShortDescription, themeDescription });
    await theme.save();
    res.status(201).json({ message: "Theme created successfully", theme });
  } catch (error) {
    res.status(500).json({ message: "Failed to create theme", error: error.message });
  }
};

// Get all themes
export const getAllThemes = async (req, res) => {
  try {
    const themes = await Theme.find().sort({ createdAt: -1 });
    // For each theme, count how many teams have selected it and get their info
    const teams = await Team.find({ teamTheme: { $ne: null } }).select('_id teamName teamCode teamTheme');
    // Map theme _id to array of teams
    const teamMap = {};
    teams.forEach(team => {
      const themeId = team.teamTheme?.toString();
      if (!themeId) return;
      if (!teamMap[themeId]) teamMap[themeId] = [];
      teamMap[themeId].push({ _id: team._id, teamName: team.teamName, teamCode: team.teamCode });
    });
    // Attach count and teams to each theme
    const themesWithTeams = themes.map(theme => {
      const enrolledTeams = teamMap[theme._id.toString()] || [];
      return {
        ...theme.toObject(),
        teamCount: enrolledTeams.length,
        enrolledTeams
      };
    });
    res.status(200).json({ themes: themesWithTeams });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch themes", error: error.message });
  }
};


//edit theme
export const editTheme = async (req, res) => {
  try {
    const { id } = req.params;
    const { themeName, themeShortDescription, themeDescription } = req.body;
    const updatedTheme = await Theme.findByIdAndUpdate(id, {
      themeName,
      themeShortDescription,
      themeDescription
    }, { new: true });
    if (!updatedTheme) {
      return res.status(404).json({ message: "Theme not found" });
    }
    res.status(200).json({ message: "Theme updated successfully", theme: updatedTheme });
  } catch (error) {
    res.status(500).json({ message: "Failed to update theme", error: error.message });
  }
};



// delete theme 
export const deleteTheme = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTheme = await Theme.findByIdAndDelete(id);
    if (!deletedTheme) {
      return res.status(404).json({ message: "Theme not found" });
    }
    res.status(200).json({ message: "Theme deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete theme", error: error.message });
  }
};


// Create a new problem statement
export const createProblemStatement = async (req, res) => {
  try {
    const { PStitle, PSdescription, PSTheme } = req.body;

    // Validation
    if (!PStitle || !PSdescription || !PSTheme) {
      return res.status(400).json({
        success: false,
        message: "PStitle, PSdescription and PSTheme are required",
      });
    }

    // Check if PSTheme is valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(String(PSTheme))) {
      return res.status(400).json({
        success: false,
        message: "PSTheme must be a valid Theme ObjectId",
      });
    }

    // Create problem statement (Mongoose string ko khud ObjectId me convert karega)
    const newProblem = await ProblemStatement.create({
      PStitle,
      PSdescription,
      PSTheme: String(PSTheme),
    });

    // Populate theme details
    await newProblem.populate("PSTheme");

    return res.status(201).json({
      success: true,
      message: "Problem Statement created successfully",
      problem: newProblem,
    });
  } catch (error) {
    console.error("createProblemStatement error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Get all problem statements (admin, no filter)
export const getAllProblemStatementsAdmin = async (req, res) => {
  try {
    const problemStatements = await ProblemStatement.find().populate('PSTheme').lean();
    res.status(200).json({ success: true, problemStatements });
  } catch (error) {
    console.error('getAllProblemStatementsAdmin error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// edit problem statement 
export const editProblemStatement = async (req, res) => {
  try {
    const { id } = req.params;
    const { PStitle, PSdescription, PSTheme } = req.body;
    const updatedProblem = await ProblemStatement.findByIdAndUpdate(id, {
      PStitle,
      PSdescription,
      PSTheme
    }, { new: true });
    if (!updatedProblem) {
      return res.status(404).json({ message: "Problem Statement not found" });
    }
    await updatedProblem.populate('PSTheme');
    res.status(200).json({ message: "Problem Statement updated successfully", problem: updatedProblem });
  } catch (error) {
    res.status(500).json({ message: "Failed to update Problem Statement", error: error.message });
  }
};


// delete problem statement
export const deleteProblemStatement = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProblem = await ProblemStatement
      .findByIdAndDelete(id);
    if (!deletedProblem) {
      return res.status(404).json({ message: "Problem Statement not found" });
    }
    res.status(200).json({ message: "Problem Statement deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete Problem Statement", error: error.message });
  }
};


// GET ALL TEAMS WITH THEIR MEMBERS
export const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find()
      .populate('teamTheme')
      .populate('teamProblemStatement')
      .select('-__v')
      .lean();
    const teamsWithMembers = await Promise.all(teams.map(async (team) => {
      const teamMembers = await User.find({ teamId: team._id })
        .select('_id fullName email phone role collegeName course collegeBranch collegeSemester GitHubProfile termsAccepted createdAt updatedAt')
        .sort({ role: 1, createdAt: 1 });
      return { ...team, members: teamMembers };
    }));
    res.status(200).json({ teams: teamsWithMembers });
  } catch (error) {
    console.error('getAllTeams error:', error);
    res.status(500).json({ message: 'Failed to fetch teams', error: error.message });
  }
};




//get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    handleError(res, error, "Error fetching users");
  }
};





// Set admin permissions by email
export const setAdminPermissions = async (req, res) => {
  try {
    const { email } = req.params;
    const { permissions } = req.body;
    if (!email || !Array.isArray(permissions)) {
      return res.status(400).json({ message: "Email and permissions array are required." });
    }
    const admin = await Admin.findOneAndUpdate(
      { email },
      { permissions },
      { new: true }
    );
    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }
    res.status(200).json({ message: "Permissions updated successfully.", admin });
  } catch (error) {
    res.status(500).json({ message: "Failed to update permissions", error: error.message });
  }
};



export const verifyPayment = async (req, res) => {
  try {
    const paymentId = req.params.id;
    if (!paymentId) {
      return res.status(400).json({
        status: 'error',
        httpCode: 400,
        message: 'Payment id missing in params',
      });
    }

    // find payment first
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({
        status: 'error',
        httpCode: 404,
        message: 'Payment not found',
      });
    }

    // find related team if any
    const teamId = payment.teamId || payment.userId || payment.user;
    const team = teamId ? await Team.findById(teamId) : null;

    // actor performing action (populated by your auth middleware)
    const admin = req.admin || req.user || null;

    // ---------- Rejected flow ----------
    if (req.body.status && String(req.body.status).toLowerCase() === 'rejected') {

        // Removed permission check for rejectPayments

      payment.status = 'Rejected';
      payment.rejectedAt = new Date();
      if (admin && admin._id) payment.rejectedBy = admin._id;

      const rejectionMessage =
        req.body.rejectionMessage ||
        'Aapka UTR number invalid/unauthorized payee par show hua hai, isliye aapka registration block kar diya gaya hai. Agar aapke paas asli proof hai to support pe contact karein.';

      // persist rejection reason
      payment.rejectionReason = rejectionMessage;
      await payment.save();

      // send rejection email and capture result
      let emailResult = { to: payment.email, template: 'payment_rejection', sent: false };
      try {
        const sentInfo = await sendRejectionEmail(payment.email, {
          name: payment.name,
          message: rejectionMessage,
        });
        emailResult.sent = true;
        emailResult.messageId = sentInfo?.messageId || sentInfo || 'unknown';
      } catch (emailErr) {
        emailResult.sent = false;
        emailResult.error = emailErr?.message || String(emailErr);
      }

      return res.status(200).json({
        status: emailResult.sent ? 'success' : 'warning',
        httpCode: 200,
        action: 'payment_rejected',
        payment: {
          _id: payment._id,
          referenceId: payment.referenceId,
          transactionId: payment.transactionId,
          status: payment.status,
          rejectionReason: payment.rejectionReason,
          rejectedBy: payment.rejectedBy || null,
          rejectedAt: payment.rejectedAt ? payment.rejectedAt.toISOString() : null,
        },
        email: {
          to: emailResult.to,
          template: emailResult.template,
          subject: 'Payment Rejected — Nav Kalpana',
          sent: emailResult.sent,
          messageId: emailResult.messageId,
          error: emailResult.error,
        },
        message: emailResult.sent
          ? 'Payment rejected and user notified by email.'
          : 'Payment rejected. Failed to send notification email — please retry or notify user manually.',
      });
    }

    // ---------- Verified / Approve flow ----------
    payment.status = 'Verified';
    payment.verifiedAt = new Date();
    if (admin && admin._id) payment.verifiedBy = admin._id;
    await payment.save();

    const { username, password } = req.body;

    const paymentSnippet = {
      _id: payment._id,
      referenceId: payment.referenceId,
      transactionId: payment.transactionId,
      status: payment.status,
      verifiedBy: payment.verifiedBy || null,
      verifiedAt: payment.verifiedAt ? payment.verifiedAt.toISOString() : null,
    };

    // If admin provided username & password -> create/update user + email creds
    if (username && password) {
      let user = await User.findOne({ email: payment.email });
      const hashed = await bcrypt.hash(password, 10);

      if (!user) {
        user = new User({
          name: payment.name,
          email: payment.email,
          phone: payment.phone,
          username,
          password: hashed,
          isActive: true,
          role: 'participant',
          team: team ? team._id : undefined,
        });
        await user.save();
      } else {
        user.username = username;
        user.password = hashed;
        user.isActive = true;
        await user.save();
      }

      // save assigned username and hashed password on payment record
      payment.assignedUsername = username;
      payment.assignedPasswordHash = user.password;
      await payment.save();

      // send credentials email (capture success/failure)
      let emailResult = { to: payment.email, template: 'credentials_email', sent: false };
      try {
        const sentInfo = await sendCredentialsEmail(payment.email, {
          teamCode: team ? team.teamCode : username,
          username,
          password, // plaintext only inside email
          name: payment.name,
          email: payment.email,
        });
        emailResult.sent = true;
        emailResult.messageId = sentInfo?.messageId || sentInfo || 'unknown';
      } catch (emailErr) {
        emailResult.sent = false;
        emailResult.error = emailErr?.message || String(emailErr);
      }

      return res.status(200).json({
        status: emailResult.sent ? 'success' : 'warning',
        httpCode: 200,
        action: 'payment_verified',
        payment: {
          ...paymentSnippet,
          assignedUsername: payment.assignedUsername,
          assignedPasswordHash: payment.assignedPasswordHash,
        },
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          username: user.username,
          isActive: user.isActive,
          role: user.role,
          teamId: user.team || null,
        },
        email: {
          to: emailResult.to,
          template: emailResult.template,
          subject: 'Your Nav Kalpana Login Credentials',
          sent: emailResult.sent,
          messageId: emailResult.messageId,
          error: emailResult.error,
        },
        message: emailResult.sent
          ? 'Payment verified, user created/updated and credentials emailed.'
          : 'Payment verified and user created/updated. Failed to send credentials email — please retry sending email.',
      });
    }

    // If no username/password provided but team has teamCode -> email team code
    if (team && team.teamCode) {
      let emailResult = { to: payment.email, template: 'teamcode_email', sent: false };
      try {
        const sentInfo = await sendCredentialsEmail(payment.email, {
          teamCode: team.teamCode,
          username: team.teamCode,
          password: 'Use your team code',
          name: payment.name,
          email: payment.email,
        });
        emailResult.sent = true;
        emailResult.messageId = sentInfo?.messageId || sentInfo || 'unknown';
      } catch (emailErr) {
        emailResult.sent = false;
        emailResult.error = emailErr?.message || String(emailErr);
      }

      return res.status(200).json({
        status: emailResult.sent ? 'success' : 'warning',
        httpCode: 200,
        action: 'payment_verified',
        payment: paymentSnippet,
        team: {
          _id: team._id,
          teamCode: team.teamCode,
        },
        email: {
          to: emailResult.to,
          template: emailResult.template,
          subject: 'Nav Kalpana — Login Instructions',
          sent: emailResult.sent,
          messageId: emailResult.messageId,
          error: emailResult.error,
        },
        message: emailResult.sent
          ? 'Payment verified and team code emailed to user.'
          : 'Payment verified. Failed to send team code email — please retry.',
      });
    }

    // default success if no credentials and no team code
    return res.status(200).json({
      status: 'success',
      httpCode: 200,
      action: 'payment_verified',
      payment: paymentSnippet,
      message: 'Payment verified. Provide credentials to send login details.',
    });
  } catch (err) {
    console.error('Verify Payment Error:', err);
    return res.status(500).json({
      status: 'error',
      httpCode: 500,
      message: 'Internal Server Error',
      error: err?.message || String(err),
    });
  }
};

// Get payment by ID
export const getPaymentById = async (req, res) => {
    try {
        const { id } = req.params;
        const payment = await Payment.findById(id);
        if (!payment) return res.status(404).json({ message: "Payment not found" });
        res.status(200).json({ payment });
    } catch (err) {
        console.error("Get Payment By ID Error:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get all payments
export const getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find({});
        res.status(200).json({ payments });
    } catch (err) {
        console.error("Get All Payments Error:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


