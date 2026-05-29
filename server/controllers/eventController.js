const Event = require('../models/event');
const User = require('../models/user');

const createEvent = async(req, res) => {
    try{
        const user = req.result;
        const {title, description, content, category, venue, startTime, endTime, price, isFree, lat, lng} = req.body;

        if(!title || !description || !content || !category || !venue || !startTime || !endTime || !typeof(price) || lat === undefined || lng === undefined){
            return res.status(400).send("All fields including location coordinates are required.");
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
            location: {
                type: 'Point',
                coordinates: [parseFloat(lng), parseFloat(lat)]
            }
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
        const {title, description, content, category, venue, startTime, endTime, price, isFree, lat, lng} = req.body;
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
        if(lat !== undefined && lng !== undefined) {
            event.location = {
                type: 'Point',
                coordinates: [parseFloat(lng), parseFloat(lat)]
            };
        }

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
        const {title, description, content, category, venue, startTime, endTime, price, isFree, lat, lng} = req.body;

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
        if(lat !== undefined && lng !== undefined) {
            event.location = {
                type: 'Point',
                coordinates: [parseFloat(lng), parseFloat(lat)]
            };
        }

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
        const { search, category, sort, userLat, userLng } = req.query;
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

        let sortOption = null;
        if (sort === 'oldest') {
            sortOption = { startTime: 1 }; // oldest first
        } else if (sort === 'nearest' && userLat && userLng) {
            query.location = {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(userLng), parseFloat(userLat)]
                    }
                }
            };
        } else {
            sortOption = { startTime: -1 }; // newest first (default)
        }

        let dbQuery = Event.find(query).select("_id title description content category venue startTime endTime price isFree organizerId location");
        if (sortOption) {
            dbQuery = dbQuery.sort(sortOption);
        }
        const events = await dbQuery;
            
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

        const event = await Event.findById(eid);

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

        if (category) {
            query.category = category;
        }

        let sortOption = null;
        if (sort === 'oldest') {
            sortOption = { startTime: 1 };
        } else if (sort === 'nearest' && userLat && userLng) {
            query.location = {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(userLng), parseFloat(userLat)]
                    }
                }
            };
        } else {
            sortOption = { startTime: -1 };
        }

        let dbQuery = Event.find(query).select("_id title description content category venue startTime endTime price isFree organizerId location");
        if (sortOption) {
            dbQuery = dbQuery.sort(sortOption);
        }
        const events = await dbQuery;

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