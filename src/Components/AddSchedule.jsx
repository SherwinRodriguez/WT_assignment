/* eslint-disable react/prop-types */
import { useRef, useState } from "react";

function AddSchedule({ onSubmit, wrapperRef }) {
  const [format, setFormat] = useState(false);
  const [customInt, setCustomInt] = useState(false);
  const [customday, setCustomday] = useState(false);
  const repeat = useRef();
  const intervalGap = useRef();
  const intervalNum = useRef();
  const selectedDays = useRef();
  const [repeatData, setRepeatData] = useState({});
  function onSelect() {
    setFormat(format ? false : true);
  }
  function repeatDay() {
    const value = repeat.current.value;
    if (value === "Custom") {
      setCustomInt(true);
    } else if (value === "Everyday") {
      setRepeatData({ intervalNum: 1, intervalGap: 0 });
    } else if (value === "Mon-Fri") {
      setRepeatData({
        intervalNum: 1,
        intervalGap: 1,
        selectedDays: [1, 2, 3, 4, 5],
      });
    } else if (value === "Weekends") {
      setRepeatData({
        intervalNum: 1,
        intervalGap: 1,
        selectedDays: [0, 6],
      });
    } else {
      setRepeatData({});
    }
  }
  function selectDay(e) {
    e.target.classList.toggle("selected");
  }
  function onWeekly() {
    const value = intervalGap.current.value;
    if (value === "Weeks") {
      setCustomday(true);
    } else {
      setCustomday(false);
    }
  }
  function saveRepeatConfig() {
    const intervals = ["Days", "Weeks", "Months", "Years"];
    const intervalGapValue = intervals.indexOf(intervalGap.current.value);
    setRepeatData({
      intervalNum: intervalNum.current.value,
      intervalGap: intervalGapValue,
    });
    if (intervalGapValue === 1) {
      const weeks = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const buttons = [...selectedDays.current.childNodes];
      const selectedButtons = buttons.filter((item) => {
        const arr = [...item.classList];
        return arr.includes("selected");
      });
      const selectedDaysValue = selectedButtons.map((item) =>
        weeks.indexOf(item.innerText)
      );
      setRepeatData((prev) => {
        const newValue = prev;
        newValue.selectedDays = selectedDaysValue;
        return newValue;
      });
    }
    setCustomInt(false);
  }
  function handleChange(e) {
    let value = e.target.value;
    if (parseInt(value, 10) < 10) {
      value = "0" + value;
    }
    e.target.value = value;
  }
  return (
    <div className="inputSchedule" ref={wrapperRef}>
      <select
        onChange={onSelect}
        defaultValue={0}
        className="formatSelection"
        name="type"
      >
        <option value={0}>Schedule</option>
        <option value={1}>Task</option>
      </select>
      <input
        type="text"
        name="title"
        id="inputText"
        required
        placeholder={`Enter ${format ? "task" : "schedule"} here`}
      />
      {format && <input type="date" name="date" id="inputDate" />}
      {/* {!format && <input type="time" name="time" id="inputTime" />} */}
      {customInt && (
        <div className="repeat">
          <h2>Repeat every...</h2>
          <div className="input">
            <input
              type="number"
              name="interval"
              id="interval"
              defaultValue={1}
              ref={intervalNum}
            />
            <select onChange={onWeekly} ref={intervalGap}>
              <option>Days</option>
              <option>Weeks</option>
              <option>Months</option>
              <option>Years</option>
            </select>
          </div>

          {customday && (
            <div className="daypicker" ref={selectedDays}>
              <button className="day" onClick={selectDay}>
                Mon
              </button>
              <button className="day" onClick={selectDay}>
                Tue
              </button>
              <button className="day" onClick={selectDay}>
                Wed
              </button>
              <button className="day" onClick={selectDay}>
                Thu
              </button>
              <button className="day" onClick={selectDay}>
                Fri
              </button>
              <button className="day" onClick={selectDay}>
                Sat
              </button>
              <button className="day" onClick={selectDay}>
                Sun
              </button>
            </div>
          )}
          <button
            type="submit"
            id="repeat-cancelbtn"
            onClick={() => {
              setCustomInt(false);
              repeat.current.value = "Everyday";
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            id="repeat-submitbtn"
            onClick={saveRepeatConfig}
          >
            Save
          </button>
        </div>
      )}

      {!format && (
        <>
          <input
            type="number"
            name="hour"
            id="inputHour"
            placeholder="HH"
            className="inputTime"
            onChange={handleChange}
            defaultValue={"00"}
          />
          <input
            type="number"
            name="minutes"
            id="inputMinutes"
            placeholder="MM"
            className="inputTime"
            max={59}
            onChange={handleChange}
            defaultValue={"00"}
          />
          <input
            type="number"
            name="seconds"
            id="inputSeconds"
            placeholder="SS"
            className="inputTime"
            max={59}
            onChange={handleChange}
            defaultValue={"00"}
          />
          <select
            onChange={repeatDay}
            ref={repeat}
            name="repeat"
            defaultValue={"Select Repeat"}
          >
            <option disabled>Select Repeat</option>
            <option>No Repeat</option>
            <option>Everyday</option>
            <option>Mon-Fri</option>
            <option>Weekends</option>
            <option>Custom</option>
          </select>
        </>
      )}
      <button
        type="submit"
        id="submit-btn"
        onClick={() => {
          onSubmit(repeatData);
        }}
      >
        +
      </button>
    </div>
  );
}

export default AddSchedule;
