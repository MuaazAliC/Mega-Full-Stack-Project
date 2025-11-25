import asyncHandler from "express-async-handler";
import webpush from "web-push";
import dotenv from "dotenv";
dotenv.config();

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

const sendNotification = asyncHandler(async (req, res) => {
  const subscription = req.body.subscription;
  const title = req.body.title || "Hello!";
  const message = req.body.message || "This is a push notification";

  if (!subscription) {
    res.status(400);
    throw new Error("Subscription object is required");
  }

  const payload = JSON.stringify({ title, message });

  try {
    await webpush.sendNotification(subscription, payload);
    return res.status(200).json({ success: true, message: "Notification sent" });
  } catch (err) {
    console.error("Error sending push notification:", err);
    res.status(500);
    throw new Error("Failed to send notification");
  }
});

export { sendNotification };


//For frontend use 
// navigator.serviceWorker.register('/sw.js').then(function(registration) {
//     return registration.pushManager.subscribe({
//         userVisibleOnly: true,
//         applicationServerKey: '<Your Public Key Here>'
//     });
// }).then(function(subscription) {
//     // Send subscription to your Node backend
//     fetch('/subscribe', {
//         method: 'POST',
//         body: JSON.stringify(subscription),
//         headers: { 'Content-Type': 'application/json' }
//     });
// });


