const Event = require("../model/eventSchema");

const addEvent = async (req, res) => {
    try {
        const { title,place, description, date, img } = req.body;
        const user = res.locals.user;

        // Create a new Event instance using the Event model
        const newEvent = new Event({
            title,
            place,
            description,
            date,
            image:img,
            creator:user._id
        });

        // Save the new event to the database
        const savedEvent = await newEvent.save();
 if (user) {
            // Add the ID of the newly created event to the user's createdEvents array
            user.createdEvents.push(savedEvent._id);

            // Save the updated user with the new event reference
            await user.save();
        res.status(201).json({ message: "Event added successfully", event: savedEvent });
 }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding event" });
    }
}

const getAllEvents = async (req,res) => {
    try {
        const events = await Event.find()
        res.status(200).json({events})
    } catch (error) {
        console.log(error)
        res.status(500).json({error:"Internal server error"})
    }
}

module.exports = {
    addEvent,
    getAllEvents
}
