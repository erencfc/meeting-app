import express from "express";
import Boom from "boom";
import bcrypt from "bcryptjs";
import { signAccessToken } from "./helpers";

import Hasura from "../../clients/hasura";
import { INSERT_USER_MUTATION, IS_EXISTS_USER } from "./queries";

import { registerSchema } from "./validations";

const router = express.Router();

router.post("/register", async (req, res, next) => {
    const input = req.body.input.data;

    input.email = input.email.toLowerCase();

    const { error } = registerSchema.validate(input);
    if (error) {
        return next(Boom.badRequest(error.details[0].message));
    }

    try {
        const isExistsUser = await Hasura.request(IS_EXISTS_USER, {
            email: input.email,
        });

        if (isExistsUser.users.length > 0) {
            throw Boom.conflict(`User already exists (${input.email})`);
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(input.password, salt);

        const { insert_users_one: user } = await Hasura.request(
            INSERT_USER_MUTATION,
            {
                input: {
                    ...input,
                    password: hash,
                },
            }
        );

        const accessToken = await signAccessToken(user);

        res.json({ accessToken });
    } catch (err) {
        return next(Boom.badRequest(err));
    }

    // res.json({ accessToken: "accessToken" });
});

export default router;
