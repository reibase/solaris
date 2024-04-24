import Stripe from "stripe";
import "dotenv/config";

const { STRIPE_SECRET_KEY } = process.env;
const stripe = new Stripe(STRIPE_SECRET_KEY);

export default async function checkSubscription(subscriptionID) {
	try {
		const subscription = await stripe.subscriptions.retrieve(subscriptionID);
		return subscription;
	} catch (error) {
		console.log(error);
		return { status: 500, error: error };
	}
}
