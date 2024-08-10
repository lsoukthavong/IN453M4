const { Semaphore } = require('async-mutex');

// Class to manage dressing rooms using a semaphore
class DressingRoom {
    constructor(nRooms) {
        this.nRooms = nRooms;
        this.semaphore = new Semaphore(nRooms);
        this.rooms = Array.from({ length: nRooms }, (_, i) => i + 1);
    }

    // Method to request access to a dressing room
    async requestRoom() {
        const [value, release] = await this.semaphore.acquire();
        const roomNumber = this.rooms.pop();
        return { release, roomNumber };
    }

    // Method to release a dressing room
    releaseRoom(roomNumber) {
        this.rooms.push(roomNumber);
        console.log(`Dressing room ${roomNumber} is now available.\n`);
    }
}

// Class to represent a customer
class Customer {
    constructor(id, nItems) {
        // Customer ID
        this.id = id;
        // Number of items to try on (random if 0)
        this.nItems = nItems === 0 ? Math.floor(Math.random() * 6) + 1 : nItems;
    }

    // Method to simulate trying on clothes
    async tryOnClothes(dressingRoom) {
        // Request a dressing room
        const { release, roomNumber } = await dressingRoom.requestRoom();
        console.log(`Dressing room ${roomNumber} is now being occupied by Customer ${this.id} with ${this.nItems} items.`);
        
        // Calculate time to try on clothes (1-3 minutes per item)
        const tryOnTime = this.nItems * (Math.floor(Math.random() * 3) + 1) * 1000;
        
        // Simulate the time taken to try on clothes
        await new Promise(resolve => setTimeout(resolve, tryOnTime));
        console.log(`Customer ${this.id} is done with dressing room ${roomNumber}.\n`);
        
        // Release the dressing room
        release();
        dressingRoom.releaseRoom(roomNumber);
    }
}

// Function to run a scenario with a given number of customers and dressing rooms
async function runScenario(scenarioNumber, nCustomers, nRooms) {
    console.log(`Starting scenario ${scenarioNumber} with ${nCustomers} customers and ${nRooms} rooms...`);
    const dressingRoom = new DressingRoom(nRooms);
    const customers = [];

    // Create customers
    for (let i = 0; i < nCustomers; i++) {
        customers.push(new Customer(i + 1, 0));
    }

    // Record start time
    const startTime = Date.now();
    
    // Run all customer threads asynchronously
    await Promise.all(customers.map(customer => customer.tryOnClothes(dressingRoom)));
    
    // Record end time
    const endTime = Date.now();

    // Calculate and log elapsed time
    const elapsedTime = (endTime - startTime) / 1000;
    console.log(`Scenario ${scenarioNumber} with ${nCustomers} customers and ${nRooms} rooms took ${elapsedTime} seconds.\n\n`);
}

// Main function to execute multiple scenarios
async function main() {
    console.log("BEGIN SIMULATION...");
    await runScenario(1, 10, 3); // Scenario 1: 10 customers, 3 rooms
    await runScenario(2, 20, 3); // Scenario 2: 20 customers, 3 rooms
    await runScenario(3, 20, 3); // Scenario 3: 20 customers, 3 rooms
    
    console.log("Simulation complete.");
}

// Execute the main function
main();
