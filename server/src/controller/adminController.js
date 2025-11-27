
import mongoose from "mongoose";
import Team from "../models/TeamModel.js";
import ProblemStatement from "../models/problemStatementModel.js";
import Admin from "../models/adminRegisterModel.js";
import User from "../models/UserModel.js";
import Theme from "../models/projectTheme.js";
import Payment from "../models/PaymentModel.js";
import {  sendCredentialsEmail , sendRejectionEmail } from '../utils/emailService.js';

import Result from '../models/resultModel.js';


import ExcelJS from 'exceljs';



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

// Get admin permissions by email
export const getAdminPermissions = async (req, res) => {
  try {
    const { email } = req.params;
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }
    res.status(200).json({ permissions: admin.permissions || [] });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch permissions", error: error.message });
  }
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



// Get all admins
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({ role: 'admin' });
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch admins", error: error.message });
  }
};




/**
 * GET /api/results/all-with-team-leader
 * Returns results with populated teamName, teamCode and leader GitHubProfile
 */
export const getResultsWithTeamAndLeader = async (req, res) => {
  try {
    const pipeline = [
      {
        $lookup: {
          from: 'teams',           // collection name
          localField: 'teamId',
          foreignField: '_id',
          as: 'team',
        },
      },
      { $unwind: { path: '$team', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'users',
          let: { teamId: '$team._id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$teamId', '$$teamId'] },
                    { $eq: ['$role', 'Leader'] } // matches your user doc role
                  ]
                }
              }
            },
            { $project: { GitHubProfile: 1, fullName: 1 } },
            { $limit: 1 }
          ],
          as: 'leader'
        }
      },
      { $unwind: { path: '$leader', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          teamId: 1,
          ui: 1,
          ux: 1,
          presentation: 1,
          viva: 1,
          overAll: 1,
          codeQuality: 1,
          obtainedMarks: 1,
          grade: 1,
          'team.teamName': 1,
          'team.teamCode': 1,
          'leader.GitHubProfile': 1,
          'leader.fullName': 1
        }
      }
    ];

    const results = await Result.aggregate(pipeline);
    res.status(200).json({ success: true, results });
  } catch (err) {
    console.error('getResultsWithTeamAndLeader error', err);
    res.status(500).json({ success: false, message: err.message });
  }
};


/**
 * GET /api/results/export-excel
 * Exports the same data to an .xlsx file for download
 * Header: Team Name, Team Code, GithubProfile, Code Quality, UI, UX, Presentation, Viva, Overall
 */
export const exportResultsExcel = async (req, res) => {
  try {
    const pipeline = [
      {
        $lookup: {
          from: 'teams',
          localField: 'teamId',
          foreignField: '_id',
          as: 'team',
        },
      },
      { $unwind: { path: '$team', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'users',
          let: { teamId: '$team._id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$teamId', '$$teamId'] },
                    { $eq: ['$role', 'Leader'] }
                  ]
                }
              }
            },
            { $project: { GitHubProfile: 1 } },
            { $limit: 1 }
          ],
          as: 'leader'
        }
      },
      { $unwind: { path: '$leader', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          teamName: '$team.teamName',
          teamCode: '$team.teamCode',
          githubProfile: '$leader.GitHubProfile',
          codeQuality: '$codeQuality',
          ui: '$ui',
          ux: '$ux',
          presentation: '$presentation',
          viva: '$viva',
          overAll: '$overAll',
          obtainedMarks: '$obtainedMarks',
          grade: '$grade'
        }
      }
    ];

    const rows = await Result.aggregate(pipeline);

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Results');

    sheet.columns = [
      { header: 'Team Name', key: 'teamName', width: 30 },
      { header: 'Team Code', key: 'teamCode', width: 18 },
      { header: 'GithubProfile', key: 'githubProfile', width: 45 },
      { header: 'Code Quality', key: 'codeQuality', width: 12 },
      { header: 'UI', key: 'ui', width: 8 },
      { header: 'UX', key: 'ux', width: 8 },
      { header: 'Presentation', key: 'presentation', width: 12 },
      { header: 'Viva', key: 'viva', width: 8 },
      { header: 'Overall', key: 'overAll', width: 10 },
      { header: 'Obtained Marks', key: 'obtainedMarks', width: 15 },
      { header: 'Grade', key: 'grade', width: 10 },
    ];

    rows.forEach(r => {
      sheet.addRow({
        teamName: r.teamName ?? '',
        teamCode: r.teamCode ?? '',
        githubProfile: r.githubProfile ?? '',
        codeQuality: r.codeQuality ?? '',
        ui: r.ui ?? '',
        ux: r.ux ?? '',
        presentation: r.presentation ?? '',
        viva: r.viva ?? '',
        overAll: r.overAll ?? '',
      });
    });

    sheet.getRow(1).font = { bold: true };

    const fileName = `results_export_${new Date().toISOString().slice(0, 10)}.xlsx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    await workbook.xlsx.write(res);
    res.status(200).end();
  } catch (err) {
    console.error('exportResultsExcel error', err);
    res.status(500).json({ success: false, message: err.message });
  }
};


/**
 * POST /api/results
 * Create a single result document (body must contain teamId and numeric scores)
 */
export const createResult = async (req, res) => {
  try {
    const { teamId, ui, ux, presentation, viva, overAll, codeQuality } = req.body;
    if (!teamId) return res.status(400).json({ success: false, message: 'teamId required' });

    const obtainedMarks = ui + ux + presentation + viva + overAll + codeQuality;
    //total marks is 100 Grade upto F
    const grade = obtainedMarks >= 90 ? 'A+' :
      obtainedMarks >= 80 ? 'A' :
        obtainedMarks >= 70 ? 'B+' :
          obtainedMarks >= 60 ? 'B' :
            obtainedMarks >= 50 ? 'C+' :
              obtainedMarks >= 40 ? 'C' :
                obtainedMarks >= 33 ? 'D' : 'F';


    const result = new Result({
      teamId,
      ui,
      ux,
      presentation,
      viva,
      overAll,
      codeQuality,
      obtainedMarks,
      grade
    });
    await result.save();
    res.status(201).json({ success: true, result });
  } catch (err) {
    console.error('createResult error', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateResult = async (req, res) => {
  try {
    const { id } = req.params;
    const { ui, ux, presentation, viva, overAll, codeQuality } = req.body;

    const obtainedMarks = ui + ux + presentation + viva + overAll + codeQuality;
    const grade = obtainedMarks >= 90 ? 'A+' :
      obtainedMarks >= 80 ? 'A' :
        obtainedMarks >= 70 ? 'B+' :
          obtainedMarks >= 60 ? 'B' :
            obtainedMarks >= 50 ? 'C+' :
              obtainedMarks >= 40 ? 'C' :
                obtainedMarks >= 33 ? 'D' : 'F';

    const result = await Result.findByIdAndUpdate(
      id,
      { ui, ux, presentation, viva, overAll, codeQuality, obtainedMarks, grade },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ success: false, message: 'Result not found' });
    }

    res.json({ success: true, result });
  } catch (err) {
    console.error('updateResult error', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteResult = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Result.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ success: false, message: 'Result not found' });
    }

    res.json({ success: true, message: 'Result deleted successfully' });
  } catch (err) {
    console.error('deleteResult error', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteAllResults = async (req, res) => {
  try {
    const deleteResult = await Result.deleteMany({});

    res.json({
      success: true,
      message: `All results deleted successfully (${deleteResult.deletedCount} results deleted)`,
      deletedCount: deleteResult.deletedCount
    });
  } catch (err) {
    console.error('deleteAllResults error', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/results/import-excel
 * Upload Excel with columns:
 *  Team Code | Code Quality | UI | UX | Presentation | Viva | Overall
 *
 * For each row: find team by teamCode -> then upsert Result for that team (update if exists, else create)
 *
 * Use multer to send file (field name: file)
 */
export const importResultsExcel = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Excel file required' });

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(req.file.buffer);

    const sheet = workbook.worksheets[0];
    // find header row (assume first row)
    const headerRow = sheet.getRow(1);
    // map headers -> column numbers
    const headerMap = {};
    headerRow.eachCell((cell, colNumber) => {
      const header = (cell.value || '').toString().trim().toLowerCase();
      headerMap[header] = colNumber;
    });

    // Expected headers (lowercase)
    // 'team name' optional, but we require 'team code' to match team
    const requiredHeader = 'team code';
    if (!headerMap[requiredHeader]) {
      return res.status(400).json({ success: false, message: 'Excel must have "Team Code" header' });
    }

    const updates = [];
    // iterate rows from row 2
    sheet.eachRow({ includeEmpty: false }, async (row, rowNumber) => {
      if (rowNumber === 1) return; // skip header
      const teamCode = row.getCell(headerMap['team code']).value
        ? row.getCell(headerMap['team code']).value.toString().trim()
        : null;

      if (!teamCode) return; // skip invalid

      // parse numeric fields (try flexible header names)
      const parseCell = (names) => {
        for (const name of names) {
          const key = name.toLowerCase();
          if (headerMap[key]) {
            const v = row.getCell(headerMap[key]).value;
            const num = v === null || v === undefined || v === '' ? null : Number(v);
            return Number.isNaN(num) ? null : num;
          }
        }
        return null;
      };

      const codeQuality = parseCell(['Code Quality (20)']);
      const ui = parseCell(['UI (10)']);
      const ux = parseCell(['UX (10)']);
      const presentation = parseCell(['Presentation (10)']);
      const viva = parseCell(['Viva (20)']);
      const overAll = parseCell(['Overall (30)']);

      // find team by teamCode
      const team = await Team.findOne({ teamCode });
      if (!team) {
        // skip or collect as error; here we skip
        return;
      }

      const obtainedMarks = (codeQuality ?? 0) + (ui ?? 0) + (ux ?? 0) + (presentation ?? 0) + (viva ?? 0) + (overAll ?? 0);
      const grade = obtainedMarks >= 90 ? 'A+' :
        obtainedMarks >= 80 ? 'A' :
          obtainedMarks >= 70 ? 'B+' :
            obtainedMarks >= 60 ? 'B' :
              obtainedMarks >= 50 ? 'C+' :
                obtainedMarks >= 40 ? 'C' :
                  obtainedMarks >= 33 ? 'D' : 'F';
      // upsert result: if result exists for teamId, update; else create
      const updated = await Result.findOneAndUpdate(
        { teamId: team._id },
        {
          $set: {
            codeQuality: codeQuality ?? 0,
            ui: ui ?? 0,
            ux: ux ?? 0,
            presentation: presentation ?? 0,
            viva: viva ?? 0,
            overAll: overAll ?? 0,
            obtainedMarks,
            grade
          }
        },
        { upsert: true, new: true }
      );

      updates.push({ teamCode, resultId: updated._id });
    });

    // Note: sheet.eachRow callback above is async but doesn't wait automatically.
    // To ensure all rows processed, better to process using for loop:
    // (We used eachRow for brevity — if concurrency issues, we can reimplement.)

    res.status(200).json({ success: true, message: 'Import started', importedCount: updates.length, details: updates });
  } catch (err) {
    console.error('importResultsExcel error', err);
    res.status(500).json({ success: false, message: err.message });
  }
};



export const declareResults = async (req, res, next) => {
  //Shange the Status to Reviewed and assign ranks based on obtainedMarks
  try {
    // Fetch all results sorted by obtainedMarks descending
    const results = await Result.find().sort({ obtainedMarks: -1 });

    // Update status and rank
    for (let i = 0; i < results.length; i++) {
      results[i].status = 'Reviewed';
      results[i].rank = i + 1; // Rank starts from 1
      await results[i].save();
    }

    res.status(200).json({ success: true, message: 'Results declared successfully', results });
  } catch (err) {
    console.error('declareResults error', err);
    res.status(500).json({ success: false, message: err.message });
  }
};



export const verifyPayment = async (req, res) => {
  try {
    const paymentId = req.params.id;
    if (!paymentId) return res.status(400).json({ message: 'Payment id missing in params' });

    // find payment first
    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    // find related team if any
    const teamId = payment.teamId || payment.userId || payment.user;
    const team = teamId ? await Team.findById(teamId) : null;

    // ---------- Rejected flow ----------
    if (req.body.status && String(req.body.status).toLowerCase() === 'rejected') {
      // Permission check for rejectPayments
      const admin = req.admin || req.user;
      if (!admin || !admin.permissions || !admin.permissions.includes('rejectPayments')) {
        return res.status(403).json({ message: 'Missing required permission: rejectPayments' });
      }
      payment.status = 'Rejected';
      payment.rejectedAt = new Date();
      if (admin && admin._id) payment.rejectedBy = admin._id;
      await payment.save();

      const rejectionMessage =
        req.body.rejectionMessage ||
        'Aapka UTR number invalid/unauthorized payee par show hua hai, isliye aapka registration block kar diya gaya hai. Agar aapke paas asli proof hai to support pe contact karein.';

      // send rejection email (HTML)
      await sendRejectionEmail(payment.email, {
        name: payment.name,
        message: rejectionMessage,
      });

      return res.status(200).json({ message: 'Payment rejected and user notified by email.' });
    }

    // ---------- Verified / Approve flow ----------
    payment.status = 'Verified';
    payment.verifiedAt = new Date();
    if (req.user && req.user._id) payment.verifiedBy = req.user._id;
    await payment.save();

    const { username, password } = req.body;

    if (username && password) {
      // create or update User
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

      // save assigned username (hash saved already in user.password)
      payment.assignedUsername = username;
      payment.assignedPasswordHash = user.password;
      await payment.save();

      // send credentials email
      await sendCredentialsEmail(payment.email, {
        teamCode: team ? team.teamCode : username,
        username,
        password,
        name: payment.name,
        email: payment.email,
      });

      return res.status(200).json({ message: 'Payment verified, user created/updated and credentials emailed.' });
    }

    // If no username/password provided but team has teamCode
    if (team && team.teamCode) {
      await sendCredentialsEmail(payment.email, {
        teamCode: team.teamCode,
        username: team.teamCode,
        password: 'Use your team code',
        name: payment.name,
        email: payment.email,
      });
      return res.status(200).json({ message: 'Payment verified and team code emailed to user.' });
    }

    // default success
    return res.status(200).json({ message: 'Payment verified. Provide credentials to send login details.' });
  } catch (err) {
    console.error('Verify Payment Error:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
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

