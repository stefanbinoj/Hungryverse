"use node";

import { action } from "../_generated/server";
import { Twilio } from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;

const client = new Twilio(accountSid, authToken);

export const validatePhoneNumber = action(
    async (ctx, { phone }: { phone: string }) => {
        try {
            const result = await client.lookups.v2.phoneNumbers(phone).fetch();
            return {
                valid: result.valid,
                phoneNumber: result.phoneNumber,
                errors: result.validationErrors,
            };
        } catch (err: any) {
            console.error("Lookup error:", err);
            return { valid: false, error: err.message };
        }
    },
);
