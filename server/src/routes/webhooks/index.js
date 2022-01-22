import express from "express";
import { createTransport } from "nodemailer";

import Hasura from "../../clients/hasura";
import { GET_MEETING_PARTICIPANTS } from "./queries";

const router = express.Router();

const smtpConfig = {
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
    },
};

const transporter = createTransport(smtpConfig);

router.post("/meeting_created", async (req, res, next) => {
    const meeting = req.body.event.data.new;

    const { meetings_by_pk } = await Hasura.request(GET_MEETING_PARTICIPANTS, {
        id: meeting.id,
    });

    const title = meeting.title;
    const { fullName } = meetings_by_pk.user;
    const participants = meetings_by_pk.participants
        .map(({ user }) => user.email)
        .toString();

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: participants,
        subject: `${fullName} sizi bir görüşmeye davet etti`,
        text: `${fullName} sizi '${title}' adlı görüşmeye davet etti.
Görüşme Tarihi: ${meeting.meeting_date}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return next(error);
        }
        return res.json({ info });
    });
});

export default router;
