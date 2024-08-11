const { Semaphore } = require('async-mutex');

// Class to manage dressing rooms using a semaphore
class DressingRoom {
    constructor(nRooms) {
        this.nRooms = nRooms;
        this.semaphore = new Semaphore(nRooms);
        this.rooms = Array.from({ length: nRooms }, (_, i) => i + 1);
        this.nextRoomIndex = 0; // Keep track of the next room to assign
    }

    // Method to request access to a dressing room
    async requestRoom() {
        const [value, release] = await this.semaphore.acquire();
        const roomNumber = this.rooms[this.nextRoomIndex]; // Get the room number
        this.nextRoomIndex = (this.nextRoomIndex + 1) % this.nRooms; // Increment and wrap around
        return { release, roomNumber };
    }

    // Method to release a dressing room
    releaseRoom(roomNumber) {
        console.log(`\nRoom Available: Dressing room ${roomNumber} is now available.`);
    }
}

// Class to represent a customer
class Customer {
    constructor(id, nItems=0) {
       
        this.id = id; // Customer ID
        this.nItems = nItems || Math.floor(Math.random() * 6) + 1;// Number of items to try on (random if 0)
    }

    // Method to simulate trying on clothes
    async tryOnClothes(dressingRoom) {
        // Execute the session with timing calculation
       const timings= await this.withTiming(dressingRoom, async (roomNumber,release) => {
    
       console.log(`Room Occupied: Dressing room ${roomNumber} is now being occupied by Customer ${this.id} with ${this.nItems} items.`);

        // Calculate time to try on clothes (1-3 minutes per item)
        const tryOnTime = this.nItems * (Math.floor(Math.random() * 3) + 1)  * 60 * 1000;

        // Simulate the time taken to try on clothes
        await new Promise(resolve => setTimeout(resolve, tryOnTime));
        console.log(`Customer ${this.id} is done with dressing room ${roomNumber}.`);

        // Release the dressing room
        release();
        dressingRoom.releaseRoom(roomNumber);

    });
        return timings;
    }

    // calculate elapsed times
    async withTiming(dressingRoom, action) {
        const requestTime = Date.now(); // Record the time when the request is made
        const { release, roomNumber } = await dressingRoom.requestRoom();
        const startTime = Date.now(); // Record the time when the room is acquired
        console.log(startTime);

        // Calculate the waiting time
        const waitingTime = (startTime - requestTime) / 1000 /60;
        console.log(`\nCustomer ${this.id} waited ${waitingTime.toFixed(2)} minutes for a dressing room.`);

        // Perform the action (e.g., trying on clothes)
        await action(roomNumber,release);

        const endTime = Date.now();
        const elapsedTime = (endTime - startTime) / 1000 /60;
        console.log(`Customer ${this.id} occupied dressing room ${roomNumber} for ${elapsedTime.toFixed(2)} minutes.\n`);
        return { waitingTime, tryOnTime: elapsedTime};
    }
}

// Function to run a scenario with a given number of customers and dressing rooms
async function runScenario(scenarioNumber, nCustomers, nRooms) {
    console.log("--------------------------------------------------------------------------------------\n");
    console.log(`Starting scenario ${scenarioNumber} with ${nCustomers} customers and ${nRooms} rooms:`);

    const dressingRoom = new DressingRoom(nRooms);
    const customers = [];
    // Create customers
    for (let i = 0; i < nCustomers; i++) {
        customers.push(new Customer(i + 1, 0));
    }    

    const startTime = Date.now();

    // Run all customer threads asynchronously
    const results = await Promise.all(
      customers.map(async (customer) => {
        const requestTime = Date.now();
        return customer.tryOnClothes(dressingRoom, requestTime);
      })
    );
  
    const endTime = Date.now();
    // Calculate times
    const totalWaitingTime = results.reduce((acc, curr) => acc + curr.waitingTime, 0); //total wait time
    const averageWaitingTime = totalWaitingTime / nCustomers; // average waiting time
    const totalTryOnTime = results.reduce((acc, curr) => acc + curr.tryOnTime, 0);
    const averageItems = customers.reduce((acc, customer) => acc + customer.nItems, 0) / nCustomers;
  
    console.log(`Scenario ${scenarioNumber} Results:`);
    console.log(`* Start Time: ${new Date(startTime).toLocaleTimeString()}`);
    console.log(`* End Time: ${new Date(endTime).toLocaleTimeString()}`);
    console.log(`* Total Elapsed Time: ${((endTime - startTime) / 1000/ 60 ).toFixed(2)} minutes`);
    console.log(`* Total Customers: ${nCustomers}`);
    console.log(`* Average Number of Items: ${averageItems.toFixed(2)}`);
    console.log(`* Total Waiting Time: ${totalWaitingTime.toFixed(2)} minutes`);
    console.log(`* Average Waiting Time: ${averageWaitingTime.toFixed(2)} minutes/customer.`);
    console.log(`* Total Dressing Room Time: ${totalTryOnTime.toFixed(2)} minutes`);
    console.log(`* Average Room Usage Time: ${(totalTryOnTime / nCustomers).toFixed(2)} minutes/customer\n`);
    console.log(`Scenario ${scenarioNumber} with ${nCustomers} customers and ${nRooms} rooms completed.\n`);
}
// Main function to execute multiple scenarios
async function main() {
    console.log("BEGIN SIMULATION...", Date.now());
    await runScenario(1, 10, 3); // Scenario 1: 10 customers, 3 rooms
    await runScenario(2, 20, 3); // Scenario 2: 20 customers, 3 rooms
    await runScenario(3, 20, 3); // Scenario 3: 20 customers, 3 rooms
    console.log("Simulation complete!  ", Date.now());
}

// Execute the main function
main();
