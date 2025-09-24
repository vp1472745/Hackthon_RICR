import User from '../models/UserModel.js';
import bcrypt from 'bcryptjs';
import { sendOTPEmail } from '../utils/emailService.js';
import { sendOTPPhone } from '../utils/phoneService.js';
import Otp from '../models/otpModel.js';
import Team from '../models/TeamModel.js'; // Make sure to import your Team model at the top

export const SendOTP = async (req, res, next) => {
    try {
        const { fullName, email, phone } = req.body;

        if (!fullName || !email || !phone) {
            const error = new Error('All fields are required');
            error.statusCode = 400;
            return next(error);
        }

        const existingUser = await User.findOne({ email });
        if (existingUser && existingUser.role === 'Leader') {
            const error = new Error('You are already registered as a Leader');
            error.statusCode = 400;
            return next(error);
        } if (existingUser && existingUser.role === 'Member') {
            const error = new Error('You are already registered as a Member');
            error.statusCode = 400;
            return next(error);
        }

        const emailOTP = Math.floor(100000 + Math.random() * 900000).toString();
        const phoneOTP = Math.floor(100000 + Math.random() * 900000).toString();

        // Send OTPs to user
        await sendOTPEmail(email, emailOTP);
        await sendOTPPhone(phone.toString(), phoneOTP);

        const hashedEmailOTP = await bcrypt.hash(emailOTP, 10);
        const hashedPhoneOTP = await bcrypt.hash(phoneOTP, 10);

        const newPhoneOTPentry = await Otp.create({
            otpfor: phone.toString(),
            otp: hashedPhoneOTP,
            type: 'phone',
        });

        const newEmailOTPentry = await Otp.create({
            otpfor: email,
            otp: hashedEmailOTP,
            type: 'email',
        });

        res.status(200).json({ message: 'OTPs sent successfully on email and phone' });
    } catch (error) {
        next(error);
    }
}

export const Register = async (req, res, next) => {
    try {
        const { fullName, email, phone, phoneOTP, emailOTP } = req.body;
        if (!fullName || !email || !phone || !phoneOTP || !emailOTP) {
            const error = new Error('All fields are required');
            error.statusCode = 400;
            return next(error);
        }

        const emailOTPEntry = await Otp.findOne({ otpfor: email, type: 'email' });
        if (!emailOTPEntry) {
            const error = new Error('Email OTP not found or expired');
            error.statusCode = 400;
            return next(error);
        }

        const isEmailOTPValid = await bcrypt.compare(emailOTP, emailOTPEntry.otp);
        if (!isEmailOTPValid) {
            const error = new Error('Invalid Email OTP');
            error.statusCode = 400;
            return next(error);
        }

        const phoneOTPEntry = await Otp.findOne({ otpfor: phone.toString(), type: 'phone' });
        if (!phoneOTPEntry) {
            const error = new Error('Phone OTP not found or expired');
            error.statusCode = 400;
            return next(error);
        }

        const isPhoneOTPValid = await bcrypt.compare(phoneOTP, phoneOTPEntry.otp);
        if (!isPhoneOTPValid) {
            const error = new Error('Invalid Phone OTP');
            error.statusCode = 400;
            return next(error);
        }


        // Generate next team code with auto-increment, format: RICR-FM-0001

        // Find the latest team code
        const lastTeam = await Team.findOne({}).sort({ createdAt: -1 });
        let nextNumber = 1;
        if (lastTeam && lastTeam.teamCode) {
            const match = lastTeam.teamCode.match(/RICR-FM-(\d+)/);
            if (match) {
                nextNumber = parseInt(match[1], 10) + 1;
            }
        }
        const nextTeamCode = `RICR-FM-${nextNumber.toString().padStart(4, '0')}`;

        // Create the team
        const newTeam = await Team.create({
            teamName: nextTeamCode + " Team",
            teamCode: nextTeamCode,
            teamemail: email  // Add team leader's email
        });

        const newUser = await User.create({
            fullName,
            email,
            phone: phone.toString(),
            role: 'Leader',
            teamId: newTeam._id
        });

        res.status(201).json({ message: 'Team created successfully', team: newTeam , user: newUser });

    } catch (error) {
        next(error);
    }
}


export const Login = async (req, res, next) => {
    try {
        const { teamCode, teamemail } = req.body;

        // ✅ Validation
        if (!teamCode || !teamemail) {
            return res.status(400).json({
                success: false,
                message: "Team Code and Team Email are required"
            });
        }

        // ✅ Email format check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(teamemail)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format"
            });
        }

        // ✅ Team find by code and email
        const team = await Team.findOne({
            teamCode: teamCode,
            teamemail: teamemail.toLowerCase()
        });

        if (!team) {
            return res.status(401).json({
                success: false,
                message: "Invalid Team Code or Email"
            });
        }

        // ✅ Success Response
        return res.status(200).json({
            success: true,
            message: "Team Login Successful",
            team: {
                id: team._id,
                teamName: team.teamName,
                teamCode: team.teamCode,
                teamemail: team.teamemail,
                teamTheme: team.teamTheme,
                teamProblemStatement: team.teamProblemStatement,
                projectGithubLink: team.projectGithubLink
            }
        });

    } catch (error) {
        console.error("Team Login Error:", error);
        next(error); // Global error handler को pass कर दो
    }
};


export const Logout = (req, res, next) => {
    try {

        res.clearCookie('token', {
            maxAge: 0,
        });
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        next(error);
    }
}
