import { Webhook } from "svix";
import User from "../models/User.js";
import Stripe from "stripe";
import { Purchase } from "../models/Purchase.js";
import Course from "../models/Course.js";

//API controller function to manage clerk user with databases

export const clerkWebhooks = async (req, res) =>{
    try{
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

        await whook.verify(JSON.stringify(req.body),{
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        })

        const {data, type} = req.body

        switch (type) {
            case 'user.created': {
                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + " "
                    +data.last_name,
                    imageUrl: data.image_url,
                }
                await User.create(userData)
                res.json({})
                break;
            }

            case 'user.updated': {
                const userData = {
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + " "
                    +data.last_name,
                    imageUrl: data.image_url,
                }
                await User.findByIdAndUpdate(data.id, userData)
                res.json({})
                break;
            }

            case 'user.deleted' : {
                await User.findByIdAndDelete(data.id)
                res.json({})
                break;
            }
            default:
                break;
        }

    } catch(error){
        res.json({success: false, message: error.message})
    }
}

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhooks = async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
        // Construct the Stripe event with raw body for signature verification
        event = stripeInstance.webhooks.constructEvent(
            req.rawBody, 
            sig, 
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error("⚠️  Webhook signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object;
                const purchaseId = session.metadata?.purchaseId;

                if (!purchaseId) {
                    console.error("⚠️  Purchase ID missing in metadata.");
                    return res.status(400).json({ success: false, message: "Metadata missing" });
                }

                const purchaseData = await Purchase.findById(purchaseId);
                if (!purchaseData) {
                    console.error("⚠️  Purchase not found.");
                    return res.status(404).json({ success: false, message: "Purchase not found" });
                }

                const userData = await User.findById(purchaseData.userId);
                const courseData = await Course.findById(purchaseData.courseId.toString());

                if (!userData || !courseData) {
                    console.error("⚠️  User or Course data not found.");
                    return res.status(404).json({ success: false, message: "User or Course not found" });
                }

                // Prevent duplicate enrollments
                if (!courseData.enrolledStudents.includes(userData._id)) {
                    courseData.enrolledStudents.push(userData._id);
                    await courseData.save();
                }

                if (!userData.enrolledCourses.includes(courseData._id)) {
                    userData.enrolledCourses.push(courseData._id);
                    await userData.save();
                }

                // Update purchase status to completed
                purchaseData.status = "completed";
                await purchaseData.save();

                console.log(`✅ Payment successful! Purchase ID: ${purchaseId}, User enrolled in: ${courseData.courseTitle}`);
                break;
            }

            case "payment_intent.payment_failed": {
                const paymentIntent = event.data.object;
                console.error(`❌ Payment failed for PaymentIntent: ${paymentIntent.id}`);

                const sessions = await stripeInstance.checkout.sessions.list({ payment_intent: paymentIntent.id });
                if (!sessions.data.length) {
                    console.error("⚠️  No session found for failed payment.");
                    return res.status(400).json({ success: false, message: "Session not found" });
                }

                const { purchaseId } = sessions.data[0].metadata;
                const purchaseData = await Purchase.findById(purchaseId);
                if (purchaseData) {
                    purchaseData.status = "failed";
                    await purchaseData.save();
                }
                break;
            }

            default:
                console.log(`⚠️  Unhandled event type: ${event.type}`);
        }

        res.json({ received: true });
    } catch (error) {
        console.error("⚠️  Webhook processing error:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};