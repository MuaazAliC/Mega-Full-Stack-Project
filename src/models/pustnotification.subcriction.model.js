import mongoose from "mongoose";

const PushSubscriptionSchema = new mongoose.Schema({
  endpoint: { type: String, required: true, unique: true },
  keys: {
    p256dh: { type: String },
    auth: { type: String }
  }
}, { timestamps: true });

export default mongoose.model("PushSubscription", PushSubscriptionSchema);
