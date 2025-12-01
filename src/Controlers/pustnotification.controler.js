import asyncHandler from "express-async-handler";
import webpush from "web-push";
import dotenv from "dotenv";
import PushSubscription from "../models/pustnotification.subcriction.model.js";

dotenv.config();

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export const saveSubscription = asyncHandler(async (req, res) => {
  const subscription = req.body.subscription;
  if (!subscription) return res.status(400).json({ error: "Subscription required" });

  const exists = await PushSubscription.findOne({ endpoint: subscription.endpoint });
  if (!exists) {
    await PushSubscription.create(subscription);
  }

  res.status(201).json({ success: true, message: "Subscribed successfully" });
});

const sendNotificationToSubscription = async (subscription, payload) => {
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload));
  } catch (err) {
    console.error("Failed to send notification:", err);
    await PushSubscription.deleteOne({ endpoint: subscription.endpoint });
  }
};

export const sendNotificationToAll = asyncHandler(async (req, res) => {
  const { title, message } = req.body;
  if (!title || !message) return res.status(400).json({ error: "Title and message required" });

  const subscriptions = await PushSubscription.find();
  const payload = { title, message };

  await Promise.all(subscriptions.map(sub => sendNotificationToSubscription(sub, payload)));

  res.status(200).json({ success: true, message: "Notifications sent" });
});
