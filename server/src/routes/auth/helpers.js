import Boom from "boom";
import JWT from "jsonwebtoken";

export const signAccessToken = (user) => {
    return new Promise((resolve, reject) => {
        const payload = {
            "https://hasura.io/jwt/claims": {
                "x-hasura-allowed-roles": ["user"],
                "x-hasura-default-role": "user",
                "x-hasura-user-id": user.id.toString(),
            },
            email: user.email,
        };

        const options = {
            expiresIn: "100d",
            issuer: "graphql",
            audience: user.id.toString(),
        };

        JWT.sign(
            payload,
            process.env.JWT_ACCESS_TOKEN_SECRET,
            options,
            (err, token) => {
                if (err) {
                    return reject(Boom.internal("JWT sign error"));
                }
                resolve(token);
            }
        );
    });
};

export const verifyAccessToken = (req, res, next) => {
    const authHeader = req.headers.authorization || req.query.token?.toString();

    if (!authHeader) {
        return next(Boom.unauthorized("No token provided"));
    }

    const bearerToken = authHeader.split(" ");
    const token = bearerToken[bearerToken.length - 1];

    JWT.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            const message =
                err.name === "JsonWebTokenEror" ? "Unauthorized" : err.message;
            return next(Boom.unauthorized(message));
        }

        req.payload = decoded;
        req.token = token;
        next();
    });
};
