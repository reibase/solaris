// This is your test secret API key.
import Stripe from "stripe";
import express from "express";
import "dotenv/config";

import { User } from "../../../db/models/index.js";

const router = express.Router();

// Endpoint secret only in production:
const { STRIPE_SECRET_KEY, STRIPE_ENDPOINT_SECRET } = process.env;

const stripe = new Stripe(STRIPE_SECRET_KEY);

router.post(
	"/",
	express.raw({ type: "application/json" }),
	async (request, response) => {
		let event = request.body;
		// Only verify the event if you have an endpoint secret defined.
		// Otherwise use the basic event deserialized with JSON.parse
		if (STRIPE_ENDPOINT_SECRET) {
			// Get the signature sent by Stripe
			const signature = request.headers["stripe-signature"];
			try {
				event = stripe.webhooks.constructEvent(
					request.body,
					signature,
					STRIPE_ENDPOINT_SECRET
				);
			} catch (err) {
				console.log(`⚠️  Webhook signature verification failed.`, err.message);
				return response.sendStatus(400);
			}
		}

		switch (event.type) {
			case "customer.subscription.created":
				await User.update(
					{
						subscriptionID: event.data.object.id,
					},
					{ where: { customerID: event.data.object.customer } }
				);
				break;
			case "customer.created":
				await User.update(
					{
						customerID: event.data.object.id,
					},
					{ where: { email: event.data.object.email } }
				);
				break;
			case "customer.subscription.updated":
				console.log(event);
				// await User.update(
				// 	{
				// 		customerID: event.data.object.id,
				// 	},
				// 	{ where: { email: event.data.object.email } }
				// );
				break;
			default:
				console.log(`Unhandled event type ${event.type}.`);
		}

		// Return a 200 response to acknowledge receipt of the event
		response.send();
	}
);

export default router;
