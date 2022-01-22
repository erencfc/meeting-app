import express from "express";
import Boom from "boom";

import dotenv from "dotenv";
dotenv.config();

import auth from "./routes/auth";

const app = express();
app.use(express.json());

app.use("/auth", auth);

app.use((req, res, next) => {
    return next(Boom.notFound("Not Found"));
});

app.use((err, req, res, next) => {
    if (err) {
        if (err.output) {
            return res
                .status(err.output.statusCode || 500)
                .json(err.output.payload);
        }
    }

    return res.status(500).json(err);
});

app.listen(4000, () => console.log("Server is up and running on port 4000"));
