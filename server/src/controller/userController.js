import User from '../models/UserModel.js';
import Team from '../models/TeamModel.js';


export const addMember = async (req, res, next) => {
    try {
        const { 
            fullName, 
            email, 
            phone, 
            collegeName, 
            course, 
            collegeBranch, 
            collegeSemester, 
            GitHubProfile,
            teamId 
        } = req.body;

        // Validate required fields
        if (!fullName || !email || !phone || !teamId) {
            const error = new Error('Full name, email, phone, and team ID are required');
            error.statusCode = 400;
            return next(error);
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            const error = new Error('Invalid email format');
            error.statusCode = 400;
            return next(error);
        }

        // Validate phone format (Indian phone number)
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(phone)) {
            const error = new Error('Invalid phone number format. Please enter a valid 10-digit Indian phone number');
            error.statusCode = 400;
            return next(error);
        }

        // Check if team exists
        const team = await Team.findById(teamId);
        if (!team) {
            const error = new Error('Team not found');
            error.statusCode = 404;
            return next(error);
        }

        // Check if user with the same email already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            const error = new Error('User with this email already exists');
            error.statusCode = 409;
            return next(error);
        }

        // Check if user with the same phone already exists
        const existingPhone = await User.findOne({ phone });
        if (existingPhone) {
            const error = new Error('User with this phone number already exists');
            error.statusCode = 409;
            return next(error);
        }

        // Check team member limit (assuming max 4 members per team)
        const teamMemberCount = await User.countDocuments({ teamId, role: { $in: ['Leader', 'Member'] } });
        if (teamMemberCount >= 4) {
            const error = new Error('Team already has maximum number of members (4)');
            error.statusCode = 400;
            return next(error);
        }

        // Create new member
        const newMember = new User({
            fullName: fullName.trim(),
            email: email.toLowerCase().trim(),
            phone: phone.trim(),
            collegeName: collegeName?.trim() || "Sample College",
            course: course?.trim() || "Sample Course",
            role: 'Member', // Always set as Member
            teamId,
            collegeBranch: collegeBranch?.trim() || "Sample Branch",
            collegeSemester: collegeSemester || 1,
            GitHubProfile: GitHubProfile?.trim() || ""
        });

        await newMember.save();

        // Populate team information in response
        await newMember.populate('teamId', 'teamName teamCode');

        res.status(201).json({ 
            success: true,
            message: 'Team member added successfully', 
            user: {
                id: newMember._id,
                fullName: newMember.fullName,
                email: newMember.email,
                phone: newMember.phone,
                role: newMember.role,
                team: {
                    id: newMember.teamId._id,
                    name: newMember.teamId.teamName,
                    code: newMember.teamId.teamCode
                },
                collegeName: newMember.collegeName,
                course: newMember.course,
                collegeBranch: newMember.collegeBranch,
                collegeSemester: newMember.collegeSemester,
                GitHubProfile: newMember.GitHubProfile,
                createdAt: newMember.createdAt
            }
        });

    } catch (error) {
        console.error('Error adding member to team:', error);
        
        // Handle mongoose validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: "Validation Error",
                errors
            });
        }

        // Handle duplicate key error
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(409).json({
                success: false,
                message: `${field === 'email' ? 'Email' : 'Phone number'} already exists`
            });
        }

        next(error);
    }
};


export const getTeamMembers = async (req, res, next) => {
    try {
        const { teamId } = req.params;

        // Validate team exists
        const team = await Team.findById(teamId);
        if (!team) {
            const error = new Error('Team not found');
            error.statusCode = 404;
            return next(error);
        }

        // Get all team members
        const members = await User.find({ teamId })
            .select('-__v')
            .populate('teamId', 'teamName teamCode')
            .sort({ createdAt: 1 }); // Leader first (created first)

        res.status(200).json({
            success: true,
            message: 'Team members retrieved successfully',
            team: {
                id: team._id,
                name: team.teamName,
                code: team.teamCode
            },
            members: members.map(member => ({
                id: member._id,
                fullName: member.fullName,
                email: member.email,
                phone: member.phone,
                role: member.role,
                collegeName: member.collegeName,
                course: member.course,
                collegeBranch: member.collegeBranch,
                collegeSemester: member.collegeSemester,
                GitHubProfile: member.GitHubProfile,
                createdAt: member.createdAt
            })),
            totalMembers: members.length
        });

    } catch (error) {
        console.error('Error getting team members:', error);
        next(error);
    }
};

export const updateMember = async (req, res, next) => {
    try {
        const { memberId } = req.params;
        const updates = req.body;   
        // Find the member
        const member = await User.findById(memberId).populate('teamId');
        if (!member) {
            const error = new Error('Member not found');
            error.statusCode = 404;
            return next(error);
        }
        // Update allowed fields
        const allowedUpdates = ['fullName', 'email', 'phone', 'collegeName', 'course', 'collegeBranch', 'collegeSemester', 'GitHubProfile'];
        for (let key of Object.keys(updates)) {
            if (allowedUpdates.includes(key)) {
                member[key] = updates[key];
            }
        }

        await member.save();
        res.status(200).json({
            success: true,
            message: 'Team member updated successfully',
            user: {
                id: member._id,
                fullName: member.fullName,
                email: member.email,
                phone: member.phone,
                role: member.role,
                team: {

                    id: member.teamId._id,
                    name: member.teamId.teamName,
                    code: member.teamId.teamCode
                },
                collegeName: member.collegeName,
                course: member.course,
                collegeBranch: member.collegeBranch,
                collegeSemester: member.collegeSemester,
                GitHubProfile: member.GitHubProfile,
                createdAt: member.createdAt
            }
        });
    } catch (error) {
        console.error('Error updating member:', error);
        next(error);
    }
};




export const removeMember = async (req, res, next) => {
    try {
        const { memberId } = req.params;

        // Find the member
        const member = await User.findById(memberId).populate('teamId');
        if (!member) {
            const error = new Error('Member not found');
            error.statusCode = 404;
            return next(error);
        }

        // Check if trying to remove a team leader
        if (member.role === 'Leader') {
            const error = new Error('Cannot remove team leader. Transfer leadership first.');
            error.statusCode = 400;
            return next(error);
        }

        // Store team info before deletion
        const teamInfo = {
            id: member.teamId._id,
            name: member.teamId.teamName,
            code: member.teamId.teamCode
        };

        // Remove the member
        await User.findByIdAndDelete(memberId);

        res.status(200).json({
            success: true,
            message: 'Team member removed successfully',
            removedMember: {
                id: member._id,
                fullName: member.fullName,
                email: member.email,
                role: member.role
            },
            team: teamInfo
        });

    } catch (error) {
        console.error('Error removing member:', error);
        next(error);
    }
};