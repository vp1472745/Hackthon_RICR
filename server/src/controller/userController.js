import User from '../models/UserModel.js';


export const addMemberToTeam = async (req, res, next) => {
    try {
        const {fullName, email, phone,collegeName,course,role,collegeBranch,collegeSemester,GitHubProfilee} = req.body;
        if (!fullName || !email || !phone || !collegeName || !course || !role ||  !collegeBranch || !collegeSemester) {
            const error = new Error('All fields are required');
            error.statusCode = 400;
            return next(error);
        }
        // Check if user with the same email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const error = new Error('User with this email already exists');
            error.statusCode = 409;
            return next(error);
        }

        // Create a new user
        const newUser = new User({
            fullName,
            email,
            phone,
            collegeName,
            course,
            role,
            teamId,
            collegeBranch,
            collegeSemester,
            GitHubProfilee
        });

        await newUser.save();

        res.status(201).json({ message: 'User added successfully', user: newUser });
    } catch (error) {
        console.error('Error adding member to team:', error);
        next(error);
    }
};