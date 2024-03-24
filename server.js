// Import required packages
const express = require('express');
const cors = require('cors');


// Create Express app
const app = express();
const port = 3001;

var corsOptions = {
    origin: "http://localhost:5173",
    credentials: true
  };

  app.use(cors(corsOptions));


// Define middleware to parse JSON bodies
app.use(express.json());


app.post('/calculate', (req, res) => {
    try {
      // Get input data from the request body
      const { 
        electricityUsageKWh, 
        transportationUsageGallonsPerMonth,
        flightsShortHaul,
        flightsMediumHaul,
        flightsLongHaul,
        dietaryChoice, // Vegan, Vegetarian, Pescatarian, MeatEater
        // recycleNewspaper, // Boolean flag for recycling newspaper
        // recycleAluminum // Boolean flag for recycling aluminum
    } = req.body;
  
      // Constants for emission factors and conversion factors
      const electricityFactor = 0.3978; // Example factor for electricity emissions calculation
      const transportationFactor = 9.087; // Example factor for transportation emissions calculation
      const kgCO2ePerYearFactor = 12; // Conversion factor for monthly to yearly emissions
      const airTravelFactorShortHaul = 100; // Example factor for short-haul flight emissions (adjust as needed)
      const airTravelFactorMediumHaul = 200; // Example factor for medium-haul flight emissions (adjust as needed)
      const airTravelFactorLongHaul = 300; // Example factor for long-haul flight emissions (adjust as needed)
      const dietaryFactors = { //daily carbon x 30 x 12 -> kg
        Vegan: 200, // Example factor for vegan diet
        Vegetarian: 400, // Example factor for vegetarian diet
        Pescatarian: 600, // Example factor for pescatarian diet
        MeatEater: 800 // Example factor for meat-eater diet 
      };
    //   const newspaperRecyclingFactor = 184; // Additional factor for not recycling newspaper
    //   const aluminumRecyclingFactor = 166; // Additional factor for not recycling aluminum
  
      // Calculate CO2 emissions for electricity and transportation
      const electricityEmissions = electricityUsageKWh * electricityFactor;
      const transportationEmissions = transportationUsageGallonsPerMonth * transportationFactor;

      // Calculate air travel emissions for each type of flight
      const airTravelEmissionsShortHaul = flightsShortHaul * airTravelFactorShortHaul;
      const airTravelEmissionsMediumHaul = flightsMediumHaul * airTravelFactorMediumHaul;
      const airTravelEmissionsLongHaul = flightsLongHaul * airTravelFactorLongHaul;

      // Calculate dietary choice emissions
      const dietaryChoiceEmissions = dietaryFactors[dietaryChoice] || 0; // Default to 0 if choice not found

      // Calculate total air travel emissions
      const totalAirTravelEmissions =
            airTravelEmissionsShortHaul + airTravelEmissionsMediumHaul + airTravelEmissionsLongHaul;
  
      // Calculate yearly totals based on monthly inputs
      const yearlyElectricityEmissions = electricityEmissions * kgCO2ePerYearFactor;
      const yearlyTransportationEmissions = transportationEmissions * kgCO2ePerYearFactor;
  
      // Calculate total yearly CO2 emissions
      const totalYearlyEmissions = 
          yearlyElectricityEmissions + 
          yearlyTransportationEmissions +
          totalAirTravelEmissions +
          dietaryChoiceEmissions;


      // Add additional factors if recycling is not done
    //   if (!recycleNewspaper) {
    //     totalYearlyEmissions += newspaperRecyclingFactor;
    //   }
  
    //   if (!recycleAluminum) {
    //     totalYearlyEmissions += aluminumRecyclingFactor;
    //   }

  
      // Prepare response object with units included
      const result = {
        electricityEmissions: { value: electricityEmissions, unit: 'kgCO2e' },
        transportationEmissions: { value: transportationEmissions, unit: 'kgCO2e' },
        airTravelEmissionsShortHaul: { value: airTravelEmissionsShortHaul, unit: 'kgCO2e/year' },
        airTravelEmissionsMediumHaul: { value: airTravelEmissionsMediumHaul, unit: 'kgCO2e/year' },
        airTravelEmissionsLongHaul: { value: airTravelEmissionsLongHaul, unit: 'kgCO2e/year' },
        totalAirTravelEmissions: { value: totalAirTravelEmissions, unit: 'kgCO2e/year' },
        yearlyElectricityEmissions: { value: yearlyElectricityEmissions, unit: 'kgCO2e/year' },
        yearlyTransportationEmissions: { value: yearlyTransportationEmissions, unit: 'kgCO2e/year' },
        dietaryChoiceEmissions: { value: dietaryChoiceEmissions, unit: 'kgCO2e/year' },
        totalYearlyEmissions: { value: totalYearlyEmissions, unit: 'kgCO2e/year' },
      };
  
      // Send the result as JSON response
      res.json(result);
    } catch (err) {
      console.error('Error calculating CO2 emissions:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
