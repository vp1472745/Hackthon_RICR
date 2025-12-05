import User from '../models/UserModel.js';
import bcrypt from 'bcryptjs';
import { sendOTPEmail, sendCredentialsEmail } from '../utils/emailService.js';
import { sendOTPPhone } from '../utils/phoneService.js';
import Otp from '../models/otpModel.js';
import Team from '../models/TeamModel.js';
import Theme from '../models/projectTheme.js';
import ProblemStatement from '../models/problemStatementModel.js';
import { generateAuthToken } from '../utils/genAuthToken.js';
import Payment from "../models/PaymentModel.js";
import { sendPaymentSubmissionEmail } from '../utils/emailService.js'; // Add this import

export const SendOTP = async (req, res, next) => {
    try {
        const { fullName, email, phone } = req.body;

        if (!fullName || !email || !phone) {
            const error = new Error('All fields are required');
            error.statusCode = 400;
            return next(error);
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
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
        
        

        // Delete any existing OTPs for this email and phone before creating new ones
        await Otp.deleteMany({ otpfor: email.toLowerCase(), type: 'email' });
        await Otp.deleteMany({ otpfor: phone.toString(), type: 'phone' });

        // Send OTPs to user
        await sendOTPEmail(email.toLowerCase(), emailOTP);
        await sendOTPPhone(phone.toString(), phoneOTP);

        const hashedEmailOTP = await bcrypt.hash(emailOTP, 10);
        const hashedPhoneOTP = await bcrypt.hash(phoneOTP, 10);

        
        const newPhoneOTPentry = await Otp.create({
            otpfor: phone.toString(),
            otp: hashedPhoneOTP,
            type: 'phone',
        });

        const newEmailOTPentry = await Otp.create({
            otpfor: email.toLowerCase(),
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

        const emailOTPEntry = await Otp.findOne({ otpfor: email.toLowerCase(), type: 'email' });
        if (!emailOTPEntry) {
            const error = new Error('Email OTP not found or expired');
            error.statusCode = 400;
            return next(error);
        }

       

        // Ensure OTP is string and trim any whitespace
        const cleanEmailOTP = emailOTP.toString().trim();
        const isEmailOTPValid = await bcrypt.compare(cleanEmailOTP, emailOTPEntry.otp);
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

        // Ensure Phone OTP is string and trim any whitespace  
        const cleanPhoneOTP = phoneOTP.toString().trim();
        const isPhoneOTPValid = await bcrypt.compare(cleanPhoneOTP, phoneOTPEntry.otp);
       
        
        if (!isPhoneOTPValid) {
            const error = new Error('Invalid Phone OTP');
            error.statusCode = 400;
            return next(error);
        }


        // Generate next team code with auto-increment, format: RICR-NK-0001

        // Find the latest team code
        const lastTeam = await Team.findOne({}).sort({ createdAt: -1 });
        let nextNumber = 1;
        if (lastTeam && lastTeam.teamCode) {
            const match = lastTeam.teamCode.match(/RICR-NK-(\d+)/);
            if (match) {
                nextNumber = parseInt(match[1], 10) + 1;
            }
        }
        const nextTeamCode = `RICR-NK-${nextNumber.toString().padStart(4, '0')}`;

        // Create the team
        const newTeam = await Team.create({
            teamName: nextTeamCode + " Team",
            teamCode: nextTeamCode
        });

        const newUser = await User.create({
            fullName,
            email: email.toLowerCase(),
            phone: phone.toString(),
            role: 'Leader',
            teamId: newTeam._id
        });



        res.status(201).json({ message: 'Team created successfully', team: newTeam, user: newUser });

    } catch (error) {
        next(error);
    }
}


export const SendCredentials = async (req, res, next) => {
    try {
        const { email, teamCode } = req.body;
        if (!email || !teamCode) {
            const error = new Error('Email and Team Code are required');
            error.statusCode = 400;
            return next(error);
        }

        // Send email with login details
        await sendCredentialsEmail(email, teamCode);

        res.status(200).json({ message: 'Login details sent to email' });
    } catch (error) {
        next(error);
    }
};

export const Login = async (req, res, next) => {
    try {
        const { teamCode, email } = req.body;
        if (!teamCode || !email) {
            const error = new Error('All fields are required');
            error.statusCode = 400;
            return next(error);
        }

        const normalizedEmail = email.toLowerCase();
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (!existingUser) {
            const error = new Error('Invalid credentials');
            error.statusCode = 401;
            return next(error);
        }

        // Find the team by the user's teamId
        const team = await Team.findById(existingUser.teamId);
        if (!team) {
            const error = new Error('Team not found for user');
            error.statusCode = 401;
            return next(error);
        }

        // Check if the teamCode matches
        if (team.teamCode !== teamCode) {
            const error = new Error('Invalid Team ID Email combination');
            error.statusCode = 401;
            return next(error);
        }

        const theme = await Theme.findById(team.teamTheme) || null;


        const ProblemStatements = await ProblemStatement.findById(team.teamProblemStatement) || null;

        // generate token, set cookie, and return token in body too
        const token = generateAuthToken(existingUser, team, res);

        res.status(200).json({
            message: 'Login successful',
            user: existingUser,
            team,
            token,
            theme,
            ProblemStatements
        });
    } catch (error) {
        next(error);
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


export const refreshData = async (req, res, next) => {
    try {
        const user = req.user;
        const team = await Team.findById(req.user.teamId._id).select('-__v').lean();
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            return next(error);
        }

        const theme = await Theme.findById(team.teamTheme) || null;
        const ProblemStatements = await ProblemStatement.findById(team.teamProblemStatement) || null;

        res.status(200).json({
            message: 'Data refreshed successfully',
            user,
            team,
            theme,
            ProblemStatements
        });

    } catch (error) {
        next(error);
    }
};







export const submitPayment = async (req, res) => {
    try {
        const { teamId, name, email, phone, referenceId, transactionId } = req.body;
        // ...existing code...

        const screenshotUrl = req.file ? req.file.path : null;

        const payment = await Payment.create({
            teamId,
            name,
            email,
            phone,
            referenceId,
            transactionId,
            screenshot: screenshotUrl,
            status: "Pending",
        });

        // Send email to Vineet with payment details
        await sendPaymentSubmissionEmail("ashish@ricr.in", {
            teamId,
            name,
            email,
            phone,
            referenceId,
            transactionId,
            screenshotUrl
        });

        return res.status(200).json({
            success: true,
            message: "Payment proof submitted successfully!",
            payment,
            screenshotUrl,
        });
    } catch (err) {
        // ...existing error handling...
    }
}



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