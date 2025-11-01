/* eslint-disable react/no-unescaped-entities */
import { useEffect, useRef, useState } from "react";
import "./App.css";
import Schedule from "./Components/Schedule";
import AddSchedule from "./Components/AddSchedule";
import Task from "./Components/Task";
import Nav from "./Components/Nav";
import play from "./assets/play.svg";
import pause from "./assets/pause.svg";
import addTaskIcon from "./assets/addTask.svg";
import trashCan from "./assets/trash - RED.ico";
import { calcTimeDelta } from "react-countdown";
function useDarkMode() {
  const [darkMode, setDarkMode] = useState(
    JSON.parse(localStorage.getItem("darkMode")) || false
  );
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    const body = document.querySelector("body");
    if (!darkMode) {
      body.classList.remove("darkbody");
    } else {
      body.classList.add("darkbody");
    }
  }, [darkMode]);
  return [darkMode, setDarkMode];
}

function useWrapperRef(setInput) {
  const wrapperRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setInput(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef, setInput]);
  return wrapperRef;
}

function App() {
  const [input, setInput] = useState(false);
  const [data, setData] = useState(
    JSON.parse(localStorage.getItem("data")) || {
      schedules: [],
      tasks: [],
      groups: [],
    }
  );

  const [darkMode, setDarkMode] = useDarkMode();
  const [currentView, setCurrentView] = useState(0);
  const [page, setPage] = useState({});
  const [playAll, setPlayAll] = useState(false);
  const [playing, setPlaying] = useState(0);
  const wrapperRef = useWrapperRef(setInput);

  useEffect(() => {
    localStorage.setItem("data", JSON.stringify(data));
    function filter(entry) {
      const date = new Date();
      if (currentView === 0) {
        if (entry.type === "0") {
          const repeatData = entry.repeatData;
          const createdDate = new Date(entry.dateCreated);
          const diffTime = Math.abs(date - createdDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          const gap = [1, 7, 30, 365];
          if (repeatData.selectedDays) {
            return repeatData.selectedDays.includes(date.getDay());
          } else if (repeatData) {
            return (
              diffDays < 1 ||
              diffDays %
                (parseInt(repeatData.intervalNum) *
                  gap[repeatData.intervalGap]) ===
                0
            );
          } else {
            return date.getDate() === createdDate.getDate();
          }
        } else {
          const taskDate = new Date(entry.date);
          return (
            taskDate.toLocaleDateString() === date.toLocaleDateString() &&
            !entry.isCompleted
          );
        }
      } else {
        return entry.group === currentView && entry.completed;
      }
    }
    const filteredSchedules = data.schedules.filter((val) => filter(val));
    const filteredTasks = data.tasks.filter((val) => filter(val));
    if (currentView === 0) {
      setPage({
        schedules: filteredSchedules,
        tasks: filteredTasks,
      });
    } else if (currentView === 1) {
      setPage({ schedules: data.schedules, tasks: [] });
    } else if (currentView === 2) {
      setPage({ schedules: [], tasks: data.tasks });
    } else {
      setPage({
        schedules: filteredSchedules,
        tasks: filteredTasks,
      });
    }
  }, [currentView, data]);

  const date = new Date();
  function onSubmit(repeatData) {
    const inputElements = [...wrapperRef.current.childNodes];
    let modData = {};

    modData.dateCreated = date;
    modData.repeatData = repeatData;
    inputElements.forEach((val) => {
      if (val.type !== "submit") {
        if (val.value === "" && val.type !== "date") {
          modData.invalid = true;
          val.classList.add("invalid");
        }
        modData[val.name] = val.value;
      }
    });
    if (modData.type === "0") {
      const duplicateTitle = data?.schedules?.filter((item) => {
        return item.title === modData.title;
      });
      modData.group = currentView;
      const invalidTime =
        modData.hour === "00" &&
        modData.minutes === "00" &&
        modData.seconds === "00";
      if (invalidTime || duplicateTitle.length > 0) {
        modData.invalid = true;
        if (invalidTime && duplicateTitle) {
          inputElements.forEach((item) => {
            if (item.type === "number" || item.type === "text") {
              item.classList.add("invalid");
            }
          });
        } else if (invalidTime) {
          inputElements.forEach((item) => {
            if (item.type === "number") {
              item.classList.add("invalid");
            }
          });
        } else if (duplicateTitle) {
          inputElements.forEach((item) => {
            if (item.type === "text") {
              item.classList.add("invalid");
            }
          });
        }
      }

      if (!modData.invalid) {
        setData((prev) => {
          return { ...prev, schedules: [...prev.schedules, modData] };
        });
        setInput(false);
      }
    } else if (modData.type === "1") {
      const duplicateTitle = data?.tasks?.filter((item) => {
        return item.title === modData.title;
      });
      modData.group = currentView;
      modData.isCompleted = false;
      modData.hasDeadline = modData.date !== "";
      if (modData.hasDeadline) {
        modData.date = new Date(modData.date);
        modData.date.setHours(23, 59, 59, 99);
        const dif = calcTimeDelta(modData.date).total;
        if (dif <= 0) {
          modData.invalid = true;
          inputElements.forEach((item) => {
            if (item.type === "date") {
              item.classList.add("invalid");
            }
          });
        }
      }
      if (duplicateTitle.length > 0) {
        modData.invalid = true;
        inputElements.forEach((item) => {
          if (item.type === "text") {
            item.classList.add("invalid");
          }
        });
      }
      if (!modData.invalid) {
        setData((prev) => {
          return { ...prev, tasks: [modData, ...prev.tasks] };
        });
        setInput(false);
      }
    }
  }
  function removeItem(event) {
    const component = event.target.parentNode.parentNode.parentNode;
    if (component.className === "schedule") {
      setData((prev) => {
        const filtered = prev.schedules.filter(
          (item, ind) => ind !== parseInt(component.id)
        );
        return { ...prev, schedules: filtered };
      });
    } else {
      setData((prev) => {
        const filtered = prev.tasks.filter(
          (item, ind) => ind !== parseInt(component.id)
        );
        return { ...prev, tasks: filtered };
      });
    }
  }

  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const schedulesData =
    page.schedules &&
    page.schedules.map((val, ind) => {
      const hour = parseInt(val.hour);
      const min = parseInt(val.minutes);
      let sec = parseInt(val.seconds);
      sec += min * 60 + hour * 3600;

      return (
        <Schedule
          key={ind}
          id={ind}
          title={val.title}
          detail=""
          date={1000 * sec}
          deadline={Date.now() + val.time}
          type={val.type}
          removeItem={removeItem}
          playAll={playAll}
          setPlayAll={setPlayAll}
          playing={playAll && ind === playing}
          currentPlaying={playing}
          setPlaying={setPlaying}
          incrementPlaying={(id) =>
            setPlaying((prev) => {
              if (playAll && prev === id) {
                const next = prev + 1;
                if (page.schedules.length === next) {
                  setPlayAll(false);
                }
                return next;
              } else {
                return prev;
              }
            })
          }
        />
      );
    });
  const tasksData =
    page.tasks &&
    page.tasks.map((val, ind) => {
      return (
        <Task
          key={ind}
          id={ind}
          title={val.title}
          deadline={val.date}
          removeItem={removeItem}
          setData={setData}
          checked={val.isCompleted}
        />
      );
    });

  const header = [
    <>
      <span>Today's Schedule</span>
      <br />
      <span className="date-value">{`${
        weekday[date.getDay()]
      } ${date.getDate()}`}</span>
    </>,
    <span key={1}>All Schedules</span>,
    <span key={2}>All Tasks</span>,
    <>
      <div
        className="group-banner"
        style={{ background: data.groups[currentView - 3]?.color }}
      ></div>
      <span>Custom Groups</span>
      <br />
      <span>{data.groups[currentView - 3]?.title}</span>
    </>,
  ];
  return (
    <>
      <Nav
        setCurrentView={setCurrentView}
        setData={setData}
        groups={data.groups}
      />
      <div className={darkMode ? "header dark" : "header"}>
        <div className="title-date">
          {currentView < 3 ? header[currentView] : header[3]}
        </div>
        <div className="title-btns">
          <button
            className="btn-dark"
            onClick={() => setDarkMode((prev) => !prev)}
          >
            Toggle
          </button>
          <button
            className="addbtn"
            onClick={() => {
              setInput(true);
            }}
          >
            {/* FIXME: The icon looks weird */}
            <img src={addTaskIcon} alt="Add Task" className="header-btn" />
          </button>
          {currentView >= 3 && (
            <button
              className="removebtn"
              onClick={() => {
                setData((prev) => {
                  const filtered = prev.groups.filter(
                    (item, ind) => ind !== currentView - 3
                  );
                  return { ...prev, groups: filtered };
                });
                setCurrentView(0);
              }}
            >
              <img src={trashCan} alt="Remove" className="trash-can" />
            </button>
          )}
        </div>
      </div>
      <main className={darkMode ? "dark" : "light"}>
        <div className="main-header">
          {page.schedules?.length > 0 && (
            <button
              className="playbtn"
              onClick={() => {
                if (playing < page.schedules.length) {
                  setPlayAll(!playAll);
                }
              }}
            >
              <img src={playAll ? pause : play} alt="play btn" />
            </button>
          )}
        </div>
        <div className="schedules">{schedulesData}</div>
        <div className="tasks">{tasksData}</div>
      </main>

      {input && <AddSchedule onSubmit={onSubmit} wrapperRef={wrapperRef} />}
    </>
  );
}

export default App;
