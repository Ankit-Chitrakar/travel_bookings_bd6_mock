const express = require("express");
const cors = require("cors");
require('dotenv').config()
const travelPackages = require("./data/travelPackeges");
const bookings = require("./data/bookings");

const app = express();

app.use(express.json());
app.use(cors());

// view db optional
app.get("/view-db", (req, res) => {
	try {
		res.status(200).json({ packages: travelPackages, bookings: bookings });
	} catch (error) {
		res.status(500).json({ error: err.message });
	}
});

// API 1: Retrieve all travel packages
app.get("/packages", (req, res) => {
	try {
		res.status(200).json({ packages: travelPackages });
	} catch (error) {
		res.status(500).json({ error: err.message });
	}
});

// API 2: Retrieve travel package by destination
app.get("/packages/:destination", (req, res) => {
	try {
		const destination = req.params.destination;
		const travelPackage = travelPackages.find(
			(pkg) => pkg.destination.toLowerCase() === destination.toLowerCase()
		);
		if (travelPackage) {
			res.status(200).json({ package: travelPackage });
		} else {
			res.status(404).json({ error: "Package not found." });
		}
	} catch (error) {
		res.status(500).json({ error: err.message });
	}
});

// API 3: Add a new booking
app.post("/bookings", (req, res) => {
	try {
		const { packageId, customerName, bookingDate, seats } = req.body;

        if (!packageId ||!customerName ||!bookingDate ||!seats) {
            return res.status(400).json({ error: "Missing required fields." });
        }

		const travelPackage = travelPackages.find(
			(pkg) => pkg.packageId === packageId
		);

		if (!travelPackage) {
			return res.status(404).json({ error: "Package not found." });
		}

		if (travelPackage.availableSlots < seats) {
			return res.status(400).json({ error: "Not enough available slots." });
		}

		const newBooking = {
			bookingId: bookings.length + 1,
			packageId,
			customerName,
			bookingDate,
			seats,
		};

		bookings.push(newBooking);
		res.status(200).json({ booking: newBooking });
	} catch (error) {
		res.status(500).json({ error: err.message });
	}
});

// API 4: Update available slots for a package
app.post("/packages/update-seats", (req, res) => {
	try {
		const { packageId, seatsBooked } = req.body;

        if (!packageId ||!seatsBooked) {
            return res.status(400).json({ error: "Missing required fields." });
        }

		const travelPackage = travelPackages.find(
			(pkg) => pkg.packageId === packageId
		);

		if (!travelPackage) {
			return res.status(404).json({ error: "Package not found." });
		}

		if (travelPackage.availableSlots < seatsBooked) {
			return res
				.status(400)
				.json({ error: "Not enough available slots to book." });
		}

		travelPackage.availableSlots -= seatsBooked;
		res.status(200).json({ package: travelPackage });
	} catch (error) {
		res.status(500).json({ error: err.message });
	}
});

// API 5: Retrieve all bookings for a package
app.get("/bookings/:packageId", (req, res) => {
	try {
		const packageId = parseInt(req.params.packageId);
		const packageBookings = bookings.filter(
			(booking) => booking.packageId === packageId
		);
		res.status(200).json({ bookings: packageBookings });
	} catch (error) {
		res.status(500).json({ error: err.message });
	}
});

module.exports = app;


