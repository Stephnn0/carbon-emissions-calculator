import { useState } from "react";
import backgroundImage from "./assets/forst.jpeg"; // Import your image
import backgroundImage3 from "./assets/3.jpeg"; // Import your image
import { Bar } from "react-chartjs-2"; // Import Bar chart from react-chartjs-2
import { Chart, registerables } from "chart.js"; // Import Chart.js and registerables

function App() {
  const [formData, setFormData] = useState({
    electricityUsageKWh: "",
    transportationUsageGallonsPerMonth: "",
    flightsShortHaul: "0",
    flightsMediumHaul: "0",
    flightsLongHaul: "0",
    dietaryChoice: "Vegan", // Default value
  });
  const [result, setResult] = useState<any>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setResult(data);

      // Update chart data after receiving new results
      setChartData({
        labels: [
          "Electricity",
          "Transportation",
          "Air Travel",
          "Dietary Choice",
        ],
        datasets: [
          {
            label: "CO2 Emissions (kgCO2e/year)",
            data: [
              data.yearlyElectricityEmissions.value || 0,
              data.yearlyTransportationEmissions.value || 0,
              data.totalAirTravelEmissions.value || 0,
              data.dietaryChoiceEmissions.value || 0,
            ],
            backgroundColor: [
              "rgba(255, 99, 132, 0.6)",
              "rgba(54, 162, 235, 0.6)",
              "rgba(255, 206, 86, 0.6)",
              "rgba(75, 192, 192, 0.6)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
            ],
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      // Handle error state
    }
  };

  Chart.register(...registerables);

  // Define chart data and options
  const [chartData, setChartData] = useState<any>({
    labels: ["Electricity", "Transportation", "Air Travel", "Dietary Choice"],
    datasets: [
      {
        label: "CO2 Emissions (kgCO2e/year)",
        data: [
          result?.yearlyElectricityEmissions.value || 0,
          result?.yearlyTransportationEmissions.value || 0,
          result?.totalAirTravelEmissions.value || 0,
          result?.dietaryChoiceEmissions.value || 0,
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  });

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <>
      <div
        className="min-h-screen flex items-center justify-center p-5 flex-col"
        style={{
          backgroundImage: `url(${backgroundImage3})`,
          backgroundSize: "cover",
        }}
      >
        <div
          className=" bg-gray-200 p-10 w-full max-w-screen-lg"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
          }}
        >
          <h1 className="text-5xl font-bold mb-6 text-center text-white">
            My Carbon Footprint
          </h1>
          <p className="text-xl font-bold text-center text-white">
            By @stephanodev
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 bg-gray-200 p-10 w-full max-w-screen-lg">
          {/* Calculator */}
          <div className="bg-white p-8 rounded-lg shadow-lg flex-1">
            <h1 className="text-3xl font-bold mb-6 text-center">
              Carbon Footprint Calculator
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Input fields */}
              <div className="flex flex-col">
                <label className="mb-2">Electricity Usage (kWh/Month):</label>
                <input
                  type="number"
                  name="electricityUsageKWh"
                  value={formData.electricityUsageKWh}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-2">
                  Transportation Gasoline Usage (Gallons/Month):
                </label>
                <input
                  type="number"
                  name="transportationUsageGallonsPerMonth"
                  value={formData.transportationUsageGallonsPerMonth}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-2">Short Flights:</label>
                <input
                  type="number"
                  name="flightsShortHaul"
                  value={formData.flightsShortHaul}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-2">Medium Flights:</label>
                <input
                  type="number"
                  name="flightsMediumHaul"
                  value={formData.flightsMediumHaul}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-2">Long Flights:</label>
                <input
                  type="number"
                  name="flightsLongHaul"
                  value={formData.flightsLongHaul}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-2">Dietary Choice:</label>
                <select
                  name="dietaryChoice"
                  value={formData.dietaryChoice}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md p-2"
                >
                  <option value="Vegan">Vegan</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Pescatarian">Pescatarian</option>
                  <option value="MeatEater">Meat Eater</option>
                </select>
              </div>
              <br />
              <div className="flex flex-col">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-300"
                >
                  Calculate
                </button>
              </div>
            </form>
          </div>

          {/* Results */}
          <div className="bg-white p-8 rounded-lg shadow-lg flex-1  ">
            <h1 className="text-3xl font-bold mb-2">
              Yearly Emissions Statistics
            </h1>
            <br />
            <Bar data={chartData} options={chartOptions} />
            {result && (
              <div className="mt-8 ">
                <div>
                  {/* <h1 className="text-2xl font-bold mb-2">
                    Yearly Emissions Statistics
                  </h1> */}
                  <p className="text-2xl font-bold">Air Travel: </p>

                  <p className="text-xl">
                    {result.totalAirTravelEmissions.value}{" "}
                    {result.totalAirTravelEmissions.unit}
                  </p>
                  <br />
                  <p className="text-2xl font-bold">Electricity: </p>
                  <p className="text-xl">
                    {result.yearlyElectricityEmissions.value}{" "}
                    {result.yearlyElectricityEmissions.unit}
                  </p>
                  <br />
                  <p className="text-2xl font-bold">Transportation: </p>
                  <p className="text-xl">
                    {result.yearlyTransportationEmissions.value}{" "}
                    {result.yearlyTransportationEmissions.unit}
                  </p>
                  <br />
                  <p className="text-2xl font-bold">Dietary Choice: </p>
                  <p className="text-xl">
                    {result.dietaryChoiceEmissions.value}{" "}
                    {result.dietaryChoiceEmissions.unit}
                  </p>
                  <br />

                  <p className="text-xl font-bold">
                    TOTAL : {result.totalYearlyEmissions.value}{" "}
                    {result.totalYearlyEmissions.unit}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
