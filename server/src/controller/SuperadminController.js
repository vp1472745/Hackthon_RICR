
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
    handleError(res, error, "Error during admin login");
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
