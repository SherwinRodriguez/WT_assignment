/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from "react";
import schedule from "../assets/schedule.png";
import todo from "../assets/todo.png";
import clock from "../assets/clock.png";
import closeSvg from "../assets/close.svg";
import expandSvg from "../assets/expand.svg";
import AddGroup from "./AddGroup";

function useExpand(value) {
  const [expand, setExpand] = useState(value);
  useEffect(() => {
    localStorage.setItem("nav", JSON.stringify(expand));
  }, [expand]);
  return [expand, setExpand];
}

function useAddGroupRef(setAddGroup) {
  const addGroupRef = useRef();
  useEffect(() => {
    function handleClickOutside(event) {
      if (addGroupRef.current && !addGroupRef.current.contains(event.target)) {
        setAddGroup(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [addGroupRef, setAddGroup]);
  return addGroupRef;
}
const Nav = ({ setCurrentView, setData, groups }) => {
  const [expand, setExpand] = useExpand(getNavValue());
  const [addGroup, setAddGroup] = useState(false);
  const addGroupRef = useAddGroupRef(setAddGroup);

  function addNewGroup() {
    const children = [...addGroupRef.current.childNodes];
    const newGroup = {};
    newGroup.title = children[1].value;
    newGroup.color = children[0].style.backgroundColor;
    const exists = [...groups].reduce(
      (prev, cur) => prev || cur.title === newGroup.title,
      false
    );
    if (!exists && newGroup.title !== "") {
      setData((prev) => {
        return { ...prev, groups: [...prev.groups, newGroup] };
      });
    }
    setAddGroup(false);
  }

  function getNavValue() {
    const val = JSON.parse(localStorage.getItem("nav"));
    return val === null ? true : val;
  }
  const allGroups =
    groups &&
    groups.map((group, ind) => {
      return (
        <button
          className={expand ? "navbtn expand" : "navbtn"}
          onClick={() => {
            setCurrentView(3 + ind);
          }}
          key={ind}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            width="24"
            viewBox="0 0 448 512"
            fill={group.color}
            className="nav-img-icons"
          >
            <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H288V368c0-26.5 21.5-48 48-48H448V96c0-35.3-28.7-64-64-64H64zM448 352H402.7 336c-8.8 0-16 7.2-16 16v66.7V480l32-32 64-64 32-32z" />
          </svg>

          {expand && <span className="group-title">{group.title}</span>}
        </button>
      );
    });
  return (
    <>
      <nav className={expand ? "nav open" : "nav"}>
        <button
          className="navbtn"
          id="hamburger"
          onClick={() => {
            setExpand(!expand);
          }}
        >
          <img src={expand ? expandSvg : closeSvg} alt="hamburger" />
        </button>
        <div className={expand ? "categories expand" : "categories"}>
          <button
            className={expand ? "navbtn expand" : "navbtn"}
            onClick={() => {
              setCurrentView(0);
            }}
          >
            <img
              src={clock}
              alt="clock icon"
              className={expand ? "nav-img-icons expand" : "nav-img-icons"}
            />
            {expand && <span>Today</span>}
          </button>
          <button
            className={expand ? "navbtn expand" : "navbtn"}
            onClick={() => {
              setCurrentView(1);
            }}
          >
            <img
              src={schedule}
              alt="schedule icon"
              className={expand ? "nav-img-icons expand" : "nav-img-icons"}
            />
            {expand && <span>Schedules</span>}
          </button>
          <button
            className={expand ? "navbtn expand" : "navbtn"}
            onClick={() => {
              setCurrentView(2);
            }}
          >
            <img
              src={todo}
              alt="todo icon"
              className={expand ? "nav-img-icons expand" : "nav-img-icons"}
            />
            {expand && <span>Tasks</span>}
          </button>
        </div>
        <div className="categories groups">{allGroups}</div>
        <button
          className={expand ? "group-add-navbtn expanded" : "group-add-navbtn"}
          onClick={() => {
            setAddGroup(true);
          }}
        >
          <span>{expand ? "Add new group" : "+"}</span>
        </button>
      </nav>
      {addGroup && <AddGroup addGroupRef={addGroupRef} onClick={addNewGroup} />}
    </>
  );
};

export default Nav;
