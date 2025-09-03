"use node";

import type{ Id } from "../_generated/dataModel";
import { action } from "../_generated/server";
import { Twilio } from "twilio";
import { api } from "../_generated/api";

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;

const client = new Twilio(accountSid, authToken);

const generateCouponCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let coupon = "";
    for (let i = 0; i < 5; i++) {
        coupon += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return coupon;
};

export const doAll = action(
    async (
        ctx,
        { phone, responseId }: { phone: string; responseId: Id<"responses"> },
    ) => {
        try {
            const couponCode = generateCouponCode();

            await ctx.runMutation(api.functions.couponCode.saveCouponCode, {
                couponCode,
                responseId,
                phoneNumber: phone,
            });

            const fromWhatsAppNumber = "whatsapp:+14155238886"; // Twilio Sandbox default

            const body = new URLSearchParams({
                To: `whatsapp:${phone}`, // must be in E.164 format
                From: fromWhatsAppNumber,
                Body: `Thank you for your feedback! Here is your coupon code: ${couponCode}`,
            });

            const res = await fetch(
                `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
                {
                    method: "POST",
                    headers: {
                        Authorization: "Basic " + btoa(`${accountSid}:${authToken}`),
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body,
                },
            );

            if (!res.ok) {
                const errorText = await res.text();
                console.error("Twilio error:", errorText);
                return { success: false, error: errorText };
            }

            const json = await res.json();
            console.log("Message sent with SID:", json);
            return { success: true, sid: json.sid };
        } catch (error: any) {
            console.error("Failed to send WhatsApp:", error);
            return { success: false, error: error.message };
        }
    },
);
