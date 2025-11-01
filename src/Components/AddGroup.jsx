import { useState } from "react";

// eslint-disable-next-line react/prop-types
const AddGroup = ({ addGroupRef, onClick }) => {
  const [pickColor, setPickColor] = useState(false);
  const [color, setColor] = useState("red");
  const colors = ["red", "blue", "green", "orange", "yellow", "violet", "grey"];
  return (
    <div className="group-name-input" ref={addGroupRef}>
      <div
        className="color-picker"
        style={{ backgroundColor: color }}
        onClick={() => setPickColor((prev) => !prev)}
      ></div>
      <input
        type="text"
        name="title"
        id="group-text-input"
        required
        placeholder="Enter Group Name"
        autoFocus
      />
      <button onClick={onClick}>Add</button>
      {pickColor && (
        <div className="color-palette">
          {colors.map((col, ind) => {
            return (
              <div
                key={ind}
                style={{ backgroundColor: col }}
                className="color"
                onClick={() => {
                  setColor(col);
                  setPickColor(false);
                }}
              ></div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AddGroup;
