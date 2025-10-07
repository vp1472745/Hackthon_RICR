import User from '../models/UserModel.js';
import Result from '../models/resultModel.js';
import Team from '../models/TeamModel.js';
import mongoose from 'mongoose';


// Get user by ID with team information (public route)
export const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid userId format" });
    }


    const user = await User.findById(userId)
      .populate({
        path: 'teamId',
        select: 'teamName teamCode teamTheme teamProblemStatement',
        populate: [
          { path: 'teamTheme', select: 'themeName themeDescription' },
          { path: 'teamProblemStatement', select: 'PStitle PSdescription' }
        ]
      });

    if (!user) {
      const error = new Error(`User with ID ${userId} not found`);
      error.statusCode = 404;
      return next(error);
    }

    // Get team members if user has a team
    let teamInfo = null;
    if (user.teamId) {
      const teamMembers = await User.find({ teamId: user.teamId })
        .select('_id fullName email phone role collegeName course collegeBranch collegeSemester GitHubProfile termsAccepted createdAt updatedAt')
        .sort({ role: 1, createdAt: 1 });

      const leader = teamMembers.find(member => member.role === 'Leader');
      const members = teamMembers.filter(member => member.role === 'Member');

      teamInfo = {
        team: user.teamId,
        leader: leader || null,
        members: members || [],
        totalMembers: teamMembers.length,
        maxCapacity: 4, // Updated to 4 total members (1 leader + 3 members)
        availableSlots: Math.max(0, 4 - teamMembers.length)
      };
    }

    res.status(200).json({
      message: 'User retrieved successfully',
      user: {
        ...user.toObject(),
        teamInfo: teamInfo
      }
    });

  } catch (error) {
    next(error);
  }
};


// Add team member
export const addTeamMember = async (req, res, next) => {
  try {
    if (!req.user) {
      const error = new Error('User not authenticated');
      error.statusCode = 401;
      return next(error);
    }

    const leaderId = req.user._id;
    const { teamId, fullName, email, phone, collegeName, course, collegeBranch, collegeSemester, GitHubProfile, city, state } = req.body;

    const leader = await User.findById(leaderId);
    if (!leader || leader.role !== 'Leader') {
      const error = new Error('Unauthorized. Only team leader can add members.');
      error.statusCode = 403;
      return next(error);
    }

    // Check if teamId matches or if leader doesn't have a team yet
    if (leader.teamId && teamId && leader.teamId.toString() !== teamId) {
      const error = new Error('Team ID mismatch. You can only add members to your own team.');
      error.statusCode = 403;
      return next(error);
    }

    if (!fullName || !email || !phone) {
      const error = new Error('Required fields: fullName, email, phone');
      error.statusCode = 400;
      return next(error);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error('User with this email already exists');
      error.statusCode = 409;
      return next(error);
    }

    // Use leader's teamId if teamId not provided or doesn't match
    const finalTeamId = teamId || leader.teamId;
    if (!finalTeamId) {
      const error = new Error('No team found. Leader must be part of a team to add members.');
      error.statusCode = 400;
      return next(error);
    }

    const currentMembers = await User.countDocuments({ teamId: finalTeamId });

    if (currentMembers >= 5) {
      const error = new Error('Team is full. Maximum 5 members allowed (1 leader + 4 members).');
      error.statusCode = 400;
      return next(error);
    }

    const newMember = await User.create({
      fullName,
      email,
      phone,
      collegeName: collegeName || "Sample College",
      course: course || "Sample Course",
      role: 'Member',
      teamId: finalTeamId,
      collegeBranch: collegeBranch || "Sample Branch",
      collegeSemester: collegeSemester || 0,
      GitHubProfile: GitHubProfile || "",
      city: city || "N/A",
      state: state || "N/A",
    });

    res.status(201).json({
      message: 'Team member added successfully',
      member: newMember
    });

  } catch (error) {
    next(error);
  }
};

// Remove team member
export const removeTeamMember = async (req, res, next) => {
  try {
    const leaderId = req.user._id;
    const { memberId } = req.body;

    const leader = await User.findById(leaderId);
    if (!leader || leader.role !== 'Leader') {
      const error = new Error('Unauthorized. Only leader can remove members.');
      error.statusCode = 403;
      return next(error);
    }

    const member = await User.findById(memberId);
    if (!member || member.teamId.toString() !== leader.teamId.toString()) {
      const error = new Error('Member not found in your team');
      error.statusCode = 404;
      return next(error);
    }

    await User.findByIdAndDelete(memberId);
    res.status(200).json({ message: 'Member removed successfully' });

  } catch (error) {
    next(error);
  }
};

// Edit team member by leader
export const editTeamMemberByLeader = async (req, res, next) => {
  try {
    const leaderId = req.user._id;
    const { memberId } = req.params;
    const updateData = req.body;

    const leader = await User.findById(leaderId);
    if (!leader || leader.role !== 'Leader') {
      const error = new Error('Unauthorized. Only leader can edit members.');
      error.statusCode = 403;
      return next(error);
    }

    const member = await User.findById(memberId);
    if (!member || member.teamId.toString() !== leader.teamId.toString()) {
      const error = new Error('Member not found in your team');
      error.statusCode = 404;
      return next(error);
    }

    delete updateData.role;
    delete updateData.teamId;

    const updatedMember = await User.findByIdAndUpdate(memberId, updateData, { new: true, runValidators: true });

    res.status(200).json({
      message: 'Team member updated successfully',
      member: updatedMember
    });

  } catch (error) {
    next(error);
  }
};



// Controller to update termsAccepted field for a user
export const updateTermsAccepted = async (req, res, next) => {
  try {
    const userId = req.user._id; // Assuming the user is authenticated and their ID is available in req.user
    const { termsAccepted } = req.body;

    if (typeof termsAccepted !== 'boolean') {
      const error = new Error('Invalid input. termsAccepted must be a boolean value.');
      error.statusCode = 400;
      return next(error);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { termsAccepted },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      const error = new Error('User not found');
      error.statusCode = 404;
      return next(error);
    }
    console.log("Terms accepted updated for user");

    res.status(200).json({
      message: 'Terms and conditions updated successfully',
      user: updatedUser
    });
  } catch (error) {
    next(error);
  }
};



export const getResult = async (req, res, next) => {
  try {
    console.log("Fetching results for user:", req.user);
    
    const userId = req.user._id; // Authenticated user ID
    const user = await User.findById(userId).populate('teamId');

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      return next(error);
    }

    // Check if user is either a Leader or Member
    if (user.role !== 'Leader' && user.role !== 'Member') {
      const error = new Error('Unauthorized. Only team leaders and members can access results.');
      error.statusCode = 403;
      return next(error);
    }

    // Check if user has a team
    if (!user.teamId) {
      return res.status(200).json({
        message: 'You are not part of any team yet',
        results: []
      });
    }

    // Fetch results for the user's team
    const results = await Result.find({ teamId: user.teamId });

    if (results.length === 0) {
      return res.status(200).json({
        message: 'No results found for your team',
        results: []
      });
    }

    if (results[0].status !== 'Reviewed') {
      return res.status(200).json({
        message: 'Results are not yet published. Please check back later.',
        results: []
      });
    }

    res.status(200).json({
      message: 'Results fetched successfully',
      results,
      userRole: user.role,
      teamInfo: user.teamId
    });
  } catch (error) {
    next(error);
  }
};

// Get leader profile with team members
export const getLeaderProfile = async (req, res, next) => {
  try {
    const leaderId = req.user._id;
    
    // Get leader information
    const leader = await User.findById(leaderId).select('-password');
    if (!leader || leader.role !== 'Leader') {
      const error = new Error('Unauthorized. Only leaders can access this endpoint.');
      error.statusCode = 403;
      return next(error);
    }

    // Get team information with all members
    const team = await Team.findById(leader.teamId);
    let teamMembers = [];
    
    if (team) {
      // Get all team members (excluding the leader)
      teamMembers = await User.find({ 
        teamId: team._id, 
        role: 'Member' 
      }).select('-password');
    }

    res.status(200).json({
      message: 'Leader profile retrieved successfully',
      leader,
      team: {
        ...team?.toObject(),
        members: teamMembers
      }
    });

  } catch (error) {
    console.error("Error in getLeaderProfile:", error);
    const err = new Error("Failed to retrieve leader profile");
    err.statusCode = 500;
    next(err);
  }
};