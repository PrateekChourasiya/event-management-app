const express = require('express');
const userMiddleware = require('../middleware/userMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const {createEvent, updateEvent, adminUpdateEvent, deleteEvent, adminDeleteEvent, getAllEvents, eventById, eventsByUser} = require('../controllers/eventController');
const eventRouter = express.Router();

eventRouter.post("/create", userMiddleware, createEvent);
eventRouter.put("/update/:eid", userMiddleware, updateEvent);
eventRouter.put("/admin/update/:eid", adminMiddleware, adminUpdateEvent);
eventRouter.delete("/delete/:eid", userMiddleware, deleteEvent);
eventRouter.delete("/admin/delete/:eid", adminMiddleware, adminDeleteEvent);

eventRouter.get("/allEvents", userMiddleware, getAllEvents);
eventRouter.get("/eventById/:eid", userMiddleware, eventById);
eventRouter.get("/eventsByUser", userMiddleware, eventsByUser);

module.exports = eventRouter;
