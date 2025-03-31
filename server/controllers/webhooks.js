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

export const stripeWebhooks = async (request, response) => {
    const sig = request.headers["stripe-signature"];
    let event;

    try {
        // Construct the Stripe event
        event = Stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error("⚠️ Webhook signature verification failed:", err.message);
        return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
        case "payment_intent.succeeded": {
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            console.log("✅ Payment successful. Payment Intent ID:", paymentIntentId);

            // Get Checkout Session
            const sessions = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,
            });

            if (!sessions.data.length) {
                console.error("❌ No session found for paymentIntentId:", paymentIntentId);
                return response.status(404).json({ success: false, message: "Session not found" });
            }

            const { purchaseId } = sessions.data[0].metadata;
            console.log("✅ Purchase ID:", purchaseId);

            // Update Purchase Status
            const purchaseData = await Purchase.findByIdAndUpdate(
                purchaseId,
                { status: "completed" },
                { new: true }
            );

            if (!purchaseData) {
                console.error("❌ Purchase not found for ID:", purchaseId);
                return response.status(404).json({ success: false, message: "Purchase not found" });
            }

            console.log("✅ Purchase updated to completed:", purchaseData);

            // ✅ Enroll the user in the course
            const userData = await User.findById(purchaseData.userId);
            const courseData = await Course.findById(purchaseData.courseId.toString());

            if (!userData || !courseData) {
                console.error("⚠️ User or Course not found.");
                return response.status(404).json({ success: false, message: "User or Course not found" });
            }

            // Add user to enrolled students
            if (!courseData.enrolledStudents.includes(userData._id)) {
                courseData.enrolledStudents.push(userData._id);
                await courseData.save();
            }

            // Add course to user's enrolled courses
            if (!userData.enrolledCourses.includes(courseData._id)) {
                userData.enrolledCourses.push(courseData._id);
                await userData.save();
            }

            console.log(`✅ User ${userData._id} enrolled in Course ${courseData._id}`);
            break;
        }

        case "payment_intent.payment_failed": {
            console.error("❌ Payment failed");

            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            // Get Checkout Session
            const sessions = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,
            });

            if (!sessions.data.length) {
                console.error("⚠️ No session found for failed payment.");
                return response.status(400).json({ success: false, message: "Session not found" });
            }

            const { purchaseId } = sessions.data[0].metadata;
            console.log("⚠️ Marking purchase as failed:", purchaseId);

            const purchaseData = await Purchase.findByIdAndUpdate(
                purchaseId,
                { status: "failed" },
                { new: true }
            );

            break;
        }

        default:
            console.log(`⚠️ Unhandled event type: ${event.type}`);
    }

    response.json({ received: true });
};