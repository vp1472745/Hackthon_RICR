export const sendOTP = (req, res) => {
    try {
        res.send('OTP sent successfully!');
    } catch (error) {
        next(error);
    }
}

export const Register = (req, res) => {
    try {
        // Registration logic here
        res.send('Register endpoint');
    } catch (error) {
        next(error);
    }
}

export const Login = (req, res) => {
    try {
        // Login logic here
    } catch (error) {
        next(error);
    }
    res.send('Login endpoint');
}

export const Logout = (req, res) => {
    try {
        // Logout logic here
    } catch (error) {
        next(error);
    }
    res.send('Logout endpoint');
}
