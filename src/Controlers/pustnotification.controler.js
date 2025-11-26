import asyncHandler from "express-async-handler";
import webpush from "web-push";
import dotenv from "dotenv";
import Subscription from "../models/pustnotification.subcriction.model.js"; 


dotenv.config();

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// Save subscription in DB
const saveSubscription = asyncHandler(async (req, res) => {
  const subscription = req.body.subscription;
  if (!subscription) {
    res.status(400);
    throw new Error("Subscription object is required");
  }

  const exists = await Subscription.findOne({ endpoint: subscription.endpoint });
  if (!exists) {
    await Subscription.create(subscription);
  }

  res.status(201).json({ success: true, message: "Subscribed successfully" });
});

// Send notification to a single subscription
const sendNotification = asyncHandler(async (subscription, title, message) => {
  const payload = JSON.stringify({ title, message });

  try {
    await webpush.sendNotification(subscription, payload);
  } catch (err) {
    console.error("Error sending push notification:", err);
    // If invalid subscription, remove it from DB
    await Subscription.deleteOne({ endpoint: subscription.endpoint });
  }
});

// Send notification to all subscribed users
const sendNotificationToAll = asyncHandler(async (title, message) => {
  const subscriptions = await Subscription.find();
  const promises = subscriptions.map((sub) =>
    sendNotification(sub, title, message)
  );
  await Promise.all(promises);
});

export { saveSubscription, sendNotification, sendNotificationToAll };
