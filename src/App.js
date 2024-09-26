import React, { useState } from "react";
import ParticlesComponent from "./components/ParticlesComponent"; // Ensure this path matches your directory structure
import "./App.css";

function App() {
  const [segmentName, setSegmentName] = useState("");
  const [dropdowns, setDropdowns] = useState([]); // Store dynamically added dropdowns
  const [selectedSchemas, setSelectedSchemas] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [errors, setErrors] = useState({ segmentName: "", dropdown: "" });

  const availableSchemas = [
    { label: "First Name", value: "first_name" },
    { label: "Last Name", value: "last_name" },
    { label: "Gender", value: "gender" },
    { label: "Age", value: "age" },
    { label: "Account Name", value: "account_name" },
    { label: "City", value: "city" },
    { label: "State", value: "state" },
  ];

  const handleAddDropdown = () => {
    setDropdowns([...dropdowns, { id: dropdowns.length, selectedValue: "" }]);
  };

  const handleAddSchema = (schema, index) => {
    const updatedDropdowns = [...dropdowns];
    updatedDropdowns[index].selectedValue = schema;
    setDropdowns(updatedDropdowns);

    if (schema && !selectedSchemas.includes(schema)) {
      setSelectedSchemas([...selectedSchemas, schema]);
      setErrors({ ...errors, dropdown: "" });
    }
  };

  const handleRemoveSchema = (schema) => {
    setSelectedSchemas(selectedSchemas.filter((item) => item !== schema));
  };

  const handleRemoveDropdown = (index) => {
    const updatedDropdowns = dropdowns.filter((_, i) => i !== index);
    setDropdowns(updatedDropdowns);
    const removedSchema = dropdowns[index].selectedValue;
    if (removedSchema) {
      handleRemoveSchema(removedSchema);
    }
  };

  const handleSaveSegment = () => {
    let valid = true;
    const newErrors = { segmentName: "", dropdown: "" };

    if (!segmentName) {
      newErrors.segmentName = "Please enter a segment name.";
      valid = false;
    }

    if (selectedSchemas.length === 0) {
      newErrors.dropdown =
        "Please select at least one schema from the dropdown.";
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) return;

    const segmentData = {
      segment_name: segmentName,
      schema: selectedSchemas.map((schema) => ({
        [schema]: schema,
      })),
    };

    console.log(segmentData, "segment");

    fetch("https://webhook.site/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(segmentData),
    })
      .then((response) => response.json())
      .then((data) => console.log("Segment saved:", data))
      .catch((error) => console.error("Error:", error));

    setIsPopupOpen(false);
  };

  return (
    <div className="App">
      <ParticlesComponent />

      <button onClick={() => setIsPopupOpen(true)}>Save Segment</button>

      {isPopupOpen && (
        <div className="popup">
          <div className="popup-content">
            <h2>Enter the Name of the segment</h2>
            <input
              type="text"
              placeholder="Enter Name of the Segment"
              value={segmentName}
              onChange={(e) => {
                setSegmentName(e.target.value);
                setErrors({ ...errors, segmentName: "" });
              }}
            />
            {errors.segmentName && (
              <p className="error">{errors.segmentName}</p>
            )}

            <button onClick={handleAddDropdown}>Add Segment</button>

            {dropdowns.map((dropdown, index) => (
              <div key={dropdown.id} className="dropdown-container">
                <select
                  value={dropdown.selectedValue}
                  onChange={(e) => handleAddSchema(e.target.value, index)}
                >
                  <option value="" disabled>
                    Add schema to segment
                  </option>
                  {availableSchemas.map((schema) => (
                    <option
                      key={schema.value}
                      value={schema.value}
                      disabled={
                        selectedSchemas.includes(schema.value) &&
                        dropdown.selectedValue !== schema.value
                      }
                    >
                      {schema.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleRemoveDropdown(index)}
                  className="remove-button"
                >
                  ❌
                </button>
              </div>
            ))}
            {errors.dropdown && <p className="error">{errors.dropdown}</p>}

            <button onClick={handleSaveSegment}>Save the Segment</button>
            <button onClick={() => setIsPopupOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
