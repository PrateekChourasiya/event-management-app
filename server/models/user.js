const mongoose = require('mongoose');

const {Schema} = mongoose;

const userSchema = new Schema(
    {
    userName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 25,
    },
    emailId: {
      type: String,
      minLength: 6,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      immutable: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    eventsOrganised: [
      {
        type: Schema.Types.ObjectId,
        ref: "event"
      }
    ],
    eventsOrganisedCount: {
        type: Number,
        default: 0,
        immutable: true,
    },
    eventsAttended: [
      {
        type: Schema.Types.ObjectId,
        ref: "event"
      }
    ],
    eventsAttendedCount: {
        type: Number,
        default: 0,
        immutable: true,
    }
    },
  { timestamps: true }
);


const User = mongoose.model("user", userSchema);

module.exports = User;