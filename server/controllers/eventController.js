const Event = require('../models/event');
const User = require('../models/user');

const createEvent = async(req, res) => {
    try{
        const user = req.result;
        const {title, description, content, category, venue, startTime, endTime, price, isFree} = req.body;

        if(!title || !description || !content || !category || !venue || !startTime || !endTime || !typeof(price)){
            return res.status(400).send("All fields are required.");
        }

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
        });

        user.eventsOrganised.push(event._id);
        user.eventsOrganisedCount++;
        await user.save();

        const reply = {
            title: event.title,
            description: event.description,
            content: event.content,
            category: event.category,
            venue: event.venue,
            startTime: event.startTime,
            endTime: event.endTime,
            price: event.price,
            isFree: event.isFree,
            organizerId: event.organizerId,
            eventId: event._id
        }

        res.status(201).json({
            success: true,
            message: "Event created successfully.",
            data: {
                event: reply,
            }
        });
    }
    catch(err){
         res.status(500).json({
            success: false,
            message: "Error: " + err
        });
    }
}

const updateEvent = async(req, res) => {
    try{
        const {eid} = req.params;
        const {title, description, content, category, venue, startTime, endTime, price, isFree} = req.body;
        const user = req.result;

        if(!eid) return res.status(400).send("Invalid Event ID");

        const event = await Event.findById(eid);
        if(user._id.toString() != event.organizerId.toString()){
            return res.status(403).send("Unauthorized");
        }
        if(!event) return res.status(404).send("Event not found");

        // Update the fields if provided
        if(title) event.title = title;
        if(description) event.description = description;
        if(content) event.content = content;
        if(category) event.category = category;
        if(venue) event.venue = venue;
        if(startTime) event.startTime = startTime;
        if(endTime) event.endTime = endTime;
        if(price !== undefined) event.price = price;
        if(isFree !== undefined) event.isFree = isFree;

        await event.save();

        const reply = {
            title: event.title,
            description: event.description,
            content: event.content,
            category: event.category,
            venue: event.venue,
            startTime: event.startTime,
            endTime: event.endTime,
            price: event.price,
            isFree: event.isFree,
            organizerId: event.organizerId,
            eventId: event._id
        }

        res.status(200).json({
            success: true,
            message: "Event updated successfully.",
            data: {
                event: reply,
            }
        });
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: "Error: " + err
        });
    }
}

const adminUpdateEvent = async(req, res) => {
    try{
        const {eid} = req.params;
        const {title, description, content, category, venue, startTime, endTime, price, isFree} = req.body;

        if(!eid) return res.status(400).send("Invalid Event ID");

        const event = await Event.findById(eid);
        if(!event) return res.status(404).send("Event not found");

        // Update the fields if provided
        if(title) event.title = title;
        if(description) event.description = description;
        if(content) event.content = content;
        if(category) event.category = category;
        if(venue) event.venue = venue;
        if(startTime) event.startTime = startTime;
        if(endTime) event.endTime = endTime;
        if(price !== undefined) event.price = price;
        if(isFree !== undefined) event.isFree = isFree;

        await event.save();

        const reply = {
            title: event.title,
            description: event.description,
            content: event.content,
            category: event.category,
            venue: event.venue,
            startTime: event.startTime,
            endTime: event.endTime,
            price: event.price,
            isFree: event.isFree,
            organizerId: event.organizerId,
            eventId: event._id
        }

        res.status(200).json({
            success: true,
            message: "Event updated successfully.",
            data: {
                event: reply,
            }
        });
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: "Error: " + err
        });
    }
}

const deleteEvent = async(req, res) => {
    try{
        const {eid} = req.params;
        const user = req.result;

        if(!eid) return res.status(400).send("Invalid Event ID");

        const event = await Event.findById(eid);
        if(!event) return res.status(404).send("Event not found");

        if(user._id.toString() != event.organizerId.toString()){
            return res.status(403).send("Unauthorized");
        }

        await Event.findByIdAndDelete(eid);

        res.status(200).json({
            success: true,
            message: "Event deleted successfully.",
        });
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: "Error: " + err
        });
    }
}

const adminDeleteEvent = async(req, res) => {
    try{
        const {eid} = req.params;

        if(!eid) return res.status(400).send("Invalid Event ID");

        const event = await Event.findById(eid);
        if(!event) return res.status(404).send("Event not found");

        await Event.findByIdAndDelete(eid);

        res.status(200).json({
            success: true,
            message: "Event deleted successfully.",
        });
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: "Error: " + err
        });
    }
}

const getAllEvents = async(req, res) => {
    try{
        const { search, category, sort } = req.query;
        let query = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } },
                { venue: { $regex: search, $options: 'i' } }
            ];
        }

        if (category) {
            query.category = category;
        }

        let sortOption = {};
        if (sort === 'oldest') {
            sortOption = { startTime: 1 }; // oldest first
        } else {
            sortOption = { startTime: -1 }; // newest first
        }

        const events = await Event.find(query)
            .sort(sortOption)
            .select("_id title description content category venue startTime endTime price isFree organizerId");
            
        res.status(200).json({
            success: true,
            message: "Events fetched successfully.",
            data: {
                events,
            }
        });
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: "Error: " + err
        });
    }
}

const eventById = async(req, res) => {
    try{
        const {eid} = req.params;
        if(!eid) return res.status(400).send("Invalid Event ID");

        const event = await Event.findById(eid).select("_id title description content category venue startTime endTime price isFree organizerId");
        if(!event) return res.status(404).send("Event not found");

        res.status(200).json({
            success: true,
            message: "Event fetched successfully.",
            data: {
                event,
            }
        });
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: "Error: " + err
        });
    }
}

const eventsByUser = async(req, res) => {
    try{
        const user = req.result;
        const { search, category, sort } = req.query;
        
        let query = { organizerId: user._id };

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } },
                { venue: { $regex: search, $options: 'i' } }
            ];
        }

        if (category) {
            query.category = category;
        }

        let sortOption = {};
        if (sort === 'oldest') {
            sortOption = { startTime: 1 };
        } else {
            sortOption = { startTime: -1 };
        }

        const events = await Event.find(query)
            .sort(sortOption)
            .select("_id title description content category venue startTime endTime price isFree organizerId");

        if(!events) return res.status(404).send("Events not found");
        
        res.status(200).json({
            success: true,
            message: "Events fetched successfully by user.",
            data: {
                events,
            }
        });
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: "Error: " + err
        });
    }
}



module.exports = {createEvent, updateEvent, adminUpdateEvent, deleteEvent, adminDeleteEvent, getAllEvents, eventById, eventsByUser}