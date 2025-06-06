import jwt from "jsonwebtoken";

const validateToken = async (req, res, next) => {
    try {
        // Get the token from the request header
        const accessToken = req.header("Authorization").replace("Bearer ", "");
        if (!accessToken) {
            return res.status(401).json({ message: "Please authenticate" });
        }

        // Verify the token
        const payload = jwt.verify(accessToken, process.env.APP_SECRET);
        // Attach the user to the request object
        req.user = payload;
        next();
    } catch (error) {
        res.status(401).json({ message: "Please authenticate" });
    }
};

export { validateToken };