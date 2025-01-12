const request = require("supertest");
const app = require("../index");
require("dotenv").config();
describe("API Tests", () => {
	let server;

	beforeAll(() => {
		server = app.listen(process.env.PORT || 3001);
	});

	afterAll(() => {
		server.close();
	});

	// Test 1: Retrieve All Packages
	it("should retrieve all travel packages", async () => {
		const res = await request(server).get("/packages");
		expect(res.statusCode).toBe(200);
		expect(Array.isArray(res.body.packages)).toBe(true);
		expect(res.body.packages.length).toBeGreaterThan(0);
	});

	// Test 2: Retrieve Package by Destination
	it("should retrieve a package by destination", async () => {
		const destination = "Moscow";
		const res = await request(server).get(`/packages/${destination}`);
		expect(res.statusCode).toBe(200);
		expect(res.body.package).toHaveProperty("destination", destination);
	});

	// Test 3: Add a New Booking
	it("should add a new booking", async () => {
		const newBooking = {
			packageId: 2,
			customerName: "John Doe",
			bookingDate: "2024-12-15",
			seats: 2,
		};
		const res = await request(server).post("/bookings").send(newBooking);
		expect(res.statusCode).toBe(200);
		expect(res.body.booking).toHaveProperty(
			"customerName",
			newBooking.customerName
		);
		expect(res.body.booking).toHaveProperty("seats", newBooking.seats);
	});

	// Test 4: Update Available Slots
	it("should update available slots for a package", async () => {
		const updateData = {
			packageId: 1,
			seatsBooked: 2,
		};
		const res = await request(server)
			.post("/packages/update-seats")
			.send(updateData);
		expect(res.statusCode).toBe(200);
		expect(res.body.package).toHaveProperty("availableSlots", 13);
	});

	// Test 5: Retrieve All Bookings for a Package
	it("should retrieve all bookings for a specific package", async () => {
		const packageId = 1;
		const res = await request(server).get(`/bookings/${packageId}`);
		expect(res.statusCode).toBe(200);
		expect(Array.isArray(res.body.bookings)).toBe(true);
		expect(res.body.bookings.length).toBeGreaterThan(0);
	});
});
