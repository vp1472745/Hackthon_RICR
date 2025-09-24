import jwt from 'jsonwebtoken';

export const generateAuthToken = async (user, team, res) => {
    const token = jwt.sign(
        { user_id: user._id, team_id: team._id },
        process.env.JWT_SECRET,
        { expiresIn: '2h' }
    );

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
        maxAge: 2 * 60 * 60 * 1000
    });
    return token;
};
