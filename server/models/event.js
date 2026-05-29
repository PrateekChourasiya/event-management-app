const mongoose = require('mongoose');

const {Schema} = mongoose;

const eventSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            minLength: 2,
            maxLength: 50
        },
        description: {
            type: String,
            required: true,
            maxLength: 2000
        },
        content: {
            type: String,
            required: true,
            maxLength: 2000
        },
        category: {
            type: String,
            enum : ["Music", "Technology", "Business", "Sports", "Arts", "Education", "Food", "Other"],
            default: "Other",
            required : true
        },
        organizerId: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        venue: {
            type: String,
            required: true
        },
        location: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
                required: true
            }
        },
        // Comments: [
        //     {
        //         type: String,
        //         maxLength: 100,
        //     }
        // ],
        views: {
            type: Number,
            default: 0,
        },
        startTime: {
            type: Date,
            required: true
        },
        endTime: {
            type: Date,
            required: true
        },
        price: {
            type: Number,
            default: 0,
            required: true
        },
        isFree: {
            type: Boolean,
            default: true
        },
        isCompleted: {
            type: Boolean,
            default: false
        },
        isCancelled: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps:true,
    }
);

eventSchema.index({ location: "2dsphere" });

const Event = mongoose.model("event", eventSchema);

module.exports = Event;