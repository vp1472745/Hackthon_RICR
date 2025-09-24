import User from '../models/UserModel.js';
import Team from '../models/TeamModel.js';

// ===================== Leader Controllers =====================

// Leader fetches own profile with complete team info
export const getLeaderProfile = async (req, res, next) => {
  try {
    const leaderId = req.user._id; // set by auth middleware
    const leader = await User.findById(leaderId).populate('teamId', 'teamName teamCode themeId createdAt');

    if (!leader || leader.role !== 'Leader') {
      const error = new Error('Unauthorized or Leader not found');
      error.statusCode = 403;
      return next(error);
    }

    // Fetch all team members
    let teamMembers = [];
    if (leader.teamId) {
      teamMembers = await User.find({ teamId: leader.teamId })
        .select('fullName email phone role collegeName course collegeBranch collegeSemester GitHubProfile createdAt')
        .sort({ role: 1, createdAt: 1 }); // Leader first
    }

    res.status(200).json({
      message: 'Leader profile with team members retrieved successfully',
      leader,
      teamMembers
    });

  } catch (error) {
    next(error);
  }
};

// Leader updates own profile
export const updateLeaderProfile = async (req, res, next) => {
  try {
    const leaderId = req.user._id;
    const updateData = req.body;

    delete updateData.role; // role cannot be changed
    delete updateData.teamId; // team cannot be changed here

    const updatedLeader = await User.findByIdAndUpdate(
      leaderId,
      updateData,
      { new: true, runValidators: true }
    ).populate('teamId', 'teamName teamCode');

    res.status(200).json({
      message: 'Leader profile updated successfully',
      profile: updatedLeader
    });
  } catch (error) {
    next(error);
  }
};

// Leader deletes own profile
export const deleteLeaderProfile = async (req, res, next) => {
  try {
    const leaderId = req.user._id;
    const leader = await User.findById(leaderId);

    if (!leader || leader.role !== 'Leader') {
      const error = new Error('Unauthorized or Leader not found');
      error.statusCode = 403;
      return next(error);
    }

    // Check if leader has team members
    const teamMembers = await User.countDocuments({ teamId: leader.teamId, role: 'Member' });
    if (teamMembers > 0) {
      const error = new Error('Cannot delete leader with active team members. Remove members first.');
      error.statusCode = 400;
      return next(error);
    }

    await User.findByIdAndDelete(leaderId);
    res.status(200).json({ message: 'Leader profile deleted successfully' });

  } catch (error) {
    next(error);
  }
};

// ===================== Team Management by Leader =====================

// Add team member
export const addTeamMember = async (req, res, next) => {
  try {
    const leaderId = req.user._id;
    const { teamId, fullName, email, phone, collegeName, course, collegeBranch, collegeSemester, GitHubProfile } = req.body;

    const leader = await User.findById(leaderId);
    if (!leader || leader.role !== 'Leader' || leader.teamId.toString() !== teamId) {
      const error = new Error('Unauthorized. Only team leader can add members.');
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

    const currentMembers = await User.countDocuments({ teamId });
    if (currentMembers >= 5) {
      const error = new Error('Team is full. Maximum 5 members allowed.');
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
      teamId,
      collegeBranch: collegeBranch || "Sample Branch",
      collegeSemester: collegeSemester || 0,
      GitHubProfile: GitHubProfile || ""
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

// ===================== Member Controllers =====================

// Member fetches own profile and team info
export const getMemberProfile = async (req, res, next) => {
  try {
    const memberId = req.user._id;
    const member = await User.findById(memberId).populate('teamId', 'teamName teamCode');

    if (!member) {
      const error = new Error('User not found');
      error.statusCode = 404;
      return next(error);
    }

    // Get other team members info
    let teamMembers = [];
    if (member.teamId) {
      teamMembers = await User.find({ teamId: member.teamId })
        .select('fullName email role createdAt')
        .sort({ role: 1, createdAt: 1 });
    }

    res.status(200).json({
      message: 'Member profile retrieved successfully',
      member,
      teamMembers
    });

  } catch (error) {
    next(error);
  }
};
