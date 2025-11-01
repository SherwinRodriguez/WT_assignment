/* eslint-disable react/prop-types */
import { useRef, useState } from "react";
import Countdown from "react-countdown";

const Timer = (props) => {
  const countdownRef = useRef();
  //TODO: Add a sound whenever timer is completed or a notification
  if (props.playing) {
    countdownRef.current.start();
  } else if (!props.playing) {
    if (
      !countdownRef.current?.isStopped() &&
      !countdownRef.current?.isPaused()
    ) {
      if (!props.playAll) {
        countdownRef.current?.pause();
      }
    }
  }
  const [remainingTime, setRemainingTime] = useState(Date.now() + props.timer);
  function toggleOnClick() {
    if (countdownRef.current.isStopped() || countdownRef.current.isPaused()) {
      countdownRef.current.start();
    } else {
      countdownRef.current.pause();
    }
  }
  function resetTime() {
    countdownRef.current.pause();
    setRemainingTime(Date.now() + props.timer);
    if (props.currentPlaying > props.id) {
      props.setPlaying(props.id);
    }
  }
  const Render = ({ formatted, completed }) => {
    if (completed) {
      return (
        <span className="countdown completed" onDoubleClick={resetTime}>
          Completed
        </span>
      );
    }
    return (
      <button
        className={props.playing ? "countdown playing" : "countdown stopped"}
        onClick={toggleOnClick}
        onDoubleClick={resetTime}
      >
        <span>
          {formatted.hours}:{formatted.minutes}:{formatted.seconds}
        </span>
      </button>
    );
  };
  const rendered = (props) => {
    return <Render {...props} />;
  };
  return (
    <>
      <Countdown
        date={remainingTime}
        renderer={rendered}
        ref={countdownRef}
        autoStart={false}
        onComplete={() => props.incrementPlaying(props.id)}
        onStart={() => {
          if (props.playAll) {
            //Can display Error message if need be
            props.setPlayAll(false);
          } else {
            props.setPlaying(props.id);
            props.setPlayAll(true);
          }
        }}
        onPause={() => props.setPlayAll(false)}
      />
    </>
  );
};

export default Timer;
