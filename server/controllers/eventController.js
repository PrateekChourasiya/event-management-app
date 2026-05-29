const Event = require('../models/event');
const User = require('../models/user');
const AppError = require('../utils/AppError');

const createEvent = async (req, res, next) => {
    try {
        const user = req.result;
        const { title, description, content, category, venue, startTime, endTime, price, isFree, lat, lng } = req.body;

        const event = await Event.create({
            title,
            description,
            content,
            category,
            venue,
            startTime,
            endTime,
            price,
            isFree,
            organizerId: user._id,
            location: {
                type: 'Point',
                coordinates: [parseFloat(lng), parseFloat(lat)]
            }
        });

        user.eventsOrganised.push(event._id);
        user.eventsOrganisedCount++;
        await user.save();

        res.status(201).json({
            success: true,
            message: 'Event created successfully.',
            data: { event }
        });
    } catch (err) {
        next(err);
    }
};

const updateEvent = async (req, res, next) => {
    try {
        const { eid } = req.params;
        const { title, description, content, category, venue, startTime, endTime, price, isFree, lat, lng, isCancelled, isCompleted } = req.body;
        const user = req.result;

        const event = await Event.findById(eid);
        if (!event) return next(new AppError('Event not found', 404));
        if (user._id.toString() !== event.organizerId.toString()) {
            return next(new AppError('You are not authorized to update this event', 403));
        }

        if (title) event.title = title;
        if (description) event.description = description;
        if (content) event.content = content;
        if (category) event.category = category;
        if (venue) event.venue = venue;
        if (startTime) event.startTime = startTime;
        if (endTime) event.endTime = endTime;
        if (price !== undefined) event.price = price;
        if (isFree !== undefined) event.isFree = isFree;
        if (lat !== undefined && lng !== undefined) {
            event.location = { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] };
        }
        if (isCancelled !== undefined) event.isCancelled = isCancelled;
        if (isCompleted !== undefined) event.isCompleted = isCompleted;

        await event.save();

        res.status(200).json({
            success: true,
            message: 'Event updated successfully.',
            data: { event }
        });
    } catch (err) {
        next(err);
    }
};

const adminUpdateEvent = async (req, res, next) => {
    try {
        const { eid } = req.params;
        const { title, description, content, category, venue, startTime, endTime, price, isFree, lat, lng, isCancelled, isCompleted } = req.body;

        const event = await Event.findById(eid);
        if (!event) return next(new AppError('Event not found', 404));

        if (title) event.title = title;
        if (description) event.description = description;
        if (content) event.content = content;
        if (category) event.category = category;
        if (venue) event.venue = venue;
        if (startTime) event.startTime = startTime;
        if (endTime) event.endTime = endTime;
        if (price !== undefined) event.price = price;
        if (isFree !== undefined) event.isFree = isFree;
        if (lat !== undefined && lng !== undefined) {
            event.location = { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] };
        }
        if (isCancelled !== undefined) event.isCancelled = isCancelled;
        if (isCompleted !== undefined) event.isCompleted = isCompleted;

        await event.save();

        res.status(200).json({
            success: true,
            message: 'Event updated successfully.',
            data: { event }
        });
    } catch (err) {
        next(err);
    }
};

const deleteEvent = async (req, res, next) => {
    try {
        const { eid } = req.params;
        const user = req.result;

        const event = await Event.findById(eid);
        if (!event) return next(new AppError('Event not found', 404));
        if (user._id.toString() !== event.organizerId.toString()) {
            return next(new AppError('You are not authorized to delete this event', 403));
        }

        await Event.findByIdAndDelete(eid);

        res.status(200).json({
            success: true,
            message: 'Event deleted successfully.'
        });
    } catch (err) {
        next(err);
    }
};

const adminDeleteEvent = async (req, res, next) => {
    try {
        const { eid } = req.params;

        const event = await Event.findById(eid);
        if (!event) return next(new AppError('Event not found', 404));

        await Event.findByIdAndDelete(eid);

        res.status(200).json({
            success: true,
            message: 'Event deleted successfully.'
        });
    } catch (err) {
        next(err);
    }
};

const getAllEvents = async (req, res, next) => {
    try {
        await Event.updateMany(
            { endTime: { $lt: new Date() }, isCompleted: false },
            { $set: { isCompleted: true } }
        );

        const { search, category, sort, userLat, userLng } = req.query;
        let query = { isCancelled: { $ne: true } };

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } },
                { venue: { $regex: search, $options: 'i' } }
            ];
        }

        if (category) query.category = category;

        let sortOption = null;
        if (sort === 'oldest') {
            sortOption = { startTime: 1 };
        } else if (sort === 'nearest' && userLat && userLng) {
            query.location = {
                $near: {
                    $geometry: { type: 'Point', coordinates: [parseFloat(userLng), parseFloat(userLat)] }
                }
            };
        } else {
            sortOption = { startTime: -1 };
        }

        let dbQuery = Event.find(query).select('_id title description content category venue startTime endTime price isFree organizerId location isCancelled isCompleted');
        if (sortOption) dbQuery = dbQuery.sort(sortOption);

        const events = await dbQuery;

        res.status(200).json({
            success: true,
            message: 'Events fetched successfully.',
            data: { events }
        });
    } catch (err) {
        next(err);
    }
};

const eventById = async (req, res, next) => {
    try {
        await Event.updateMany(
            { endTime: { $lt: new Date() }, isCompleted: false },
            { $set: { isCompleted: true } }
        );

        const { eid } = req.params;
        const event = await Event.findById(eid);
        if (!event) return next(new AppError('Event not found', 404));

        res.status(200).json({
            success: true,
            message: 'Event fetched successfully.',
            data: { event }
        });
    } catch (err) {
        next(err);
    }
};

const eventsByUser = async (req, res, next) => {
    try {
        await Event.updateMany(
            { endTime: { $lt: new Date() }, isCompleted: false },
            { $set: { isCompleted: true } }
        );

        const user = req.result;
        const { search, category, sort, userLat, userLng } = req.query;
        let query = { organizerId: user._id };

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } },
                { venue: { $regex: search, $options: 'i' } }
            ];
        }

        if (category) query.category = category;

        let sortOption = null;
        if (sort === 'oldest') {
            sortOption = { startTime: 1 };
        } else if (sort === 'nearest' && userLat && userLng) {
            query.location = {
                $near: {
                    $geometry: { type: 'Point', coordinates: [parseFloat(userLng), parseFloat(userLat)] }
                }
            };
        } else {
            sortOption = { startTime: -1 };
        }

        let dbQuery = Event.find(query).select('_id title description content category venue startTime endTime price isFree organizerId location isCancelled isCompleted');
        if (sortOption) dbQuery = dbQuery.sort(sortOption);

        const events = await dbQuery;

        res.status(200).json({
            success: true,
            message: 'Events fetched successfully.',
            data: { events }
        });
    } catch (err) {
        next(err);
    }
};

module.exports = { createEvent, updateEvent, adminUpdateEvent, deleteEvent, adminDeleteEvent, getAllEvents, eventById, eventsByUser };