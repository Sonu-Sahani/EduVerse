import { Webhook } from "svix";
import User from "../models/User.js";

export const clerkWebhooks = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        // Verify the webhook signature
        const payload = JSON.stringify(req.body);
        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        };

        const evt = whook.verify(payload, headers);

        // Extract data & event type
        const { data, type } = evt;

        switch (type) {
            case "user.created": {
                const userData = {
                    _id: data.id,
                    email: data.email_addresses?.[0]?.email_address || "",
                    imageUrl: data.image_url || "",
                };
                await User.create(userData);
                return res.status(201).json({ success: true, message: "User created" });
            }

            case "user.updated": {
                const userData = {
                    email: data.email_addresses?.[0]?.email_address || "",
                    imageUrl: data.image_url || "",
                };
                await User.findByIdAndUpdate(data.id, userData, { new: true });
                return res.status(200).json({ success: true, message: "User updated" });
            }

            case "user.deleted": {
                await User.findByIdAndDelete(data.id);
                return res.status(200).json({ success: true, message: "User deleted" });
            }

            default:
                return res.status(400).json({ success: false, message: "Unknown event type" });
        }
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};
