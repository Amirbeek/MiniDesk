const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const User = require("./models/User");
const Note = require("./models/Notes");
const Todos = require("./models/Todos");
const jwt = require("jsonwebtoken");

passport.use(new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.CLIENT_URL + "/google/callback",
        passReqToCallback: true,
    },
    async (request, accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ googleId: profile.id });

            if (!user) {
                user = new User({
                    googleId: profile.id,
                    email: profile.emails[0].value,
                    name: profile.displayName,
                    username: profile.emails[0].value,  // Use Google email as username
                    isActive: true,  // Assuming Google login directly activates the account
                });

                // Create default note and todos
                const defaultNote = new Note({
                    title: 'Your Node',
                    content: [],
                    creator: user._id,
                });
                user.notes.push(defaultNote);
                await defaultNote.save();

                const defaultTodo = new Todos({
                    title: 'Your Todo',
                    creator: user._id,
                    todos: [
                        { text: 'Set up your first task', done: false },
                        { text: 'Complete your first todo item', done: false },
                        { text: 'Explore the platform features', done: false },
                    ],
                });
                user.todos.push(defaultTodo);
                await defaultTodo.save();

                await user.save();
            }

            // Generate JWT token for the user
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

            return done(null, { user, token });
        } catch (err) {
            return done(err,'Hello world ami');
        }
    }
));

exports.AuthGoogle = passport.authenticate('google', {
    scope: ['profile', 'email'],
});

exports.AuthGoogleCallBack = passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        const { user, token } = req.user;

        // Send back the user data and JWT token
        return res.status(200).json({
            message: 'Google login successful',
            token: token,
            user: user,
        });
    };

exports.postAuth = passport.authenticate('google', {
    session: false,  // Use sessionless authentication if you're not maintaining sessions
    failureRedirect: '/login',  // Redirect to /login if authentication fails
}), (req, res) => {
    // This code will only run if Google authentication is successful
    console.log('User authenticated:', req.user);

    // Generate JWT token for the user
    const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Send the response with the token and user data
    res.json({
        token,
        user: req.user,
    });
};
