/* eslint-disable react/prop-types */
import { useState } from "react";
import Timer from "./Timer";
import trashCan from "../assets/trash - RED.ico";

const Schedule = (props) => {
  const [expand, setExpand] = useState(false);
  //TODO: implement drag and drop to reorder schedules and tasks
  return (
    <div className="schedule" id={props.id}>
      <div className="title-container">
        <span className="title" onClick={() => setExpand((prev) => !prev)}>
          {`⏰ ${props.title}`}
        </span>
        <Timer
          timer={props.date}
          deadline={props.deadline}
          playAll={props.playAll}
          setPlayAll={props.setPlayAll}
          playing={props.playing}
          currentPlaying={props.currentPlaying}
          setPlaying={props.setPlaying}
          incrementPlaying={props.incrementPlaying}
          id={props.id}
        />
      </div>
      {expand && (
        <div className="detail">
          <span>{props.detail}</span>
          <button className="removebtn" onClick={props.removeItem}>
            <img src={trashCan} alt="Remove" className="trash-can" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Schedule;
