import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from './assets/Faculty_Stacked.gif';
import ac from './assets/AmitChakma.jpg';
import axios from "axios";
import Collapsible from 'react-collapsible';
import { REACT_APP_IP, REACT_APP_PORT} from "./config";
//import courseOutline from "../../backend/models/courseOutline";

function AdminPage()
{
    const [data, setData] = useState(null); //data to determine wether user is logged in or not.
    const [outlines, setOutlines] = useState([]);
    const [viewOutlines, outlineView] = useState(false);
    const [view, setView] = useState("Unapproved Outlines");
    const [comment, setComment] = useState("Unapproved Outlines");
    const navigate = useNavigate();

    async function displayOutlines() {
        const res = await fetch(`http://${REACT_APP_IP}:${REACT_APP_PORT}/isSubmitTrue`);
        const data = await res.json();

        setOutlines([...data]);
        console.log(outlines);
    }


//prof drop down stuff
    function profSearch() {
        document.getElementById("profDiv").classList.toggle("show");
    }

    getProfNamesData();
    const prof = document.getElementById('profName');

    let profNames = [];

    async function getProfNamesData() {
        const res = await fetch("http://localhost:4000/users/prof");
        const data = await res.json();

        profNames = data.map((prof) => {
            return prof.email;
        });
    }

    function newProfInput(){

        clearProfDropDown();

        const currentProf = prof.value.toLowerCase();

        if(currentProf.length === 0){
            return;
        }
        
        const filteredNames = [];

        profNames.forEach((profNames) => {
            if(profNames.substr(0, currentProf.length).toLowerCase() === currentProf){
                filteredNames.push(profNames);
            }
        });

        updateProfDropDown(filteredNames);
    }

    function updateProfDropDown(profList) {
        const listElement = document.createElement("ul");
        listElement.id = "profId";

        profList.forEach((prof) => {
            const listItem = document.createElement("li");
            const profBtn = document.createElement("button");
            profBtn.innerHTML = prof;
            profBtn.addEventListener("click",onProfClick);
            listItem.appendChild(profBtn);

            listElement.appendChild(listItem);
        });

        document.getElementById('profDiv').appendChild(listElement);

    }

    function onProfClick(e) {
        const btnElement = e.target;
        const selectedProf = document.getElementById("selectProf");
        selectedProf.innerHTML = btnElement.innerHTML;
        clearProfDropDown();
    }

    function clearProfDropDown() {
        const listElement = document.getElementById('profId');
        if(listElement){
            listElement.remove();
        }
    }

    //course drop down stuff
    function courseSearch() {
        document.getElementById("courseDiv").classList.toggle("show");
    }

    const course = document.getElementById('course');

    let courseNames = ["ECE3375", "ECE3376", "ECE4467", "ECE2343"];

    function newCourseInput(){

        clearCourseDropDown();

        const currentCourse = course.value.toLowerCase();

        const filteredNames = [];

        if(currentCourse.length === 0){
            return;
        }


        courseNames.forEach((courseNames) => {
            if(courseNames.substr(0, currentCourse.length).toLowerCase() === currentCourse){
                filteredNames.push(courseNames);
            }
        });

        updateCourseDropDown(filteredNames);
    }

    function updateCourseDropDown(courseList) {
        const listElement = document.createElement("ul");
        listElement.id = "courseId";

        courseList.forEach((course) => {
            const listItem = document.createElement("li");
            const courseBtn = document.createElement("button");
            courseBtn.innerHTML = course;
            courseBtn.addEventListener("click",onCourseClick);
            listItem.appendChild(courseBtn);

            listElement.appendChild(listItem);
        });

        document.getElementById('courseDiv').appendChild(listElement);

    }

    function onCourseClick(e) {
        const btnElement = e.target;
        const selectedCourse = document.getElementById("selectCourse");
        selectedCourse.innerHTML = btnElement.innerHTML;
        clearCourseDropDown();
    }

    function clearCourseDropDown() {
        const listElement = document.getElementById('courseId');
        if(listElement){
            listElement.remove();
        }
    }

    const validateEmail = (email) => {
        return String(email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
      };

    const assignProf = (email, course) => {

        if(validateEmail(email)){
            axios({
                method: "PUT",
                "class":{
                    courseName: course,
                },
                withCredentials: true,
                url: `http://localhost:4000/users/${email}/${course}`,
            }).then((res) => {
                console.log(res);
            });

            alert(`prof ${email} will teach course ${course}`);
        }
        else{
            alert(`user: ${email} does not exist`);
        }

        
    }


    const expand = (data) => {
        return (
          <Collapsible trigger="View Outline To Approve">
            <pre>
              {data}
            </pre>
          </Collapsible>
        );
      };

      const addComment = (id,content) => {
        var currentdate = new Date();
        var formDateTime = "Last commented by: " + currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
        axios({
            method: "PUT",
            data: {
                currentDateTime: formDateTime,
                comments: `Comment by: ${data.email}\n${comment}`,
            },
            withCredentials : true,
            url: `http://${REACT_APP_IP}:${REACT_APP_PORT}/outlines/${id}/comment`,
        }).then((res) => {
            console.log(res);
        });
        alert(`comment ${comment} has been added!`);
    };

    const displayUnapproved = outlines.map(data => (
        <li>
            <div className="DE">
                <h3>{`${data.courseOutlineID}`}{"\n"}{data.class}</h3>
                {expand(data.courseOutlineContent)}
                <h5>{`Created by: ${data.userID}`}</h5>
                <input placeholder='Comment' onChange={async e => { setComment(e.target.value); console.log(comment)}} />
                <button onClick={() => {addComment(data.courseOutlineID);}}>{`Comment Outline ${data.courseOutlineID}`}</button>
                <button onClick={() => {approveOutline(data.courseOutlineID);}}>{`Approve Outline ${data.courseOutlineID}`}</button>
            </div>
            <br className="break"></br>
        </li>
    ))

    const approveOutline = (id) => {
        var currentdate = new Date();
        var formDateTime = "Approved on: " + currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
        axios({
            method: "PUT",
            data: {
                isApproved: true,
                currentDateTime: formDateTime,
            },
            withCredentials : true,
            url: `http://${REACT_APP_IP}:${REACT_APP_PORT}/outlines/${id}/approve`,
        }).then((res) => {
            console.log(res);
        });
        alert(`Outline ${id} has been approved`);
    };

    const logOut = () => {
        axios({
          method: "POST",
          withCredentials: true,
          url: `http://${REACT_APP_IP}:${REACT_APP_PORT}/logout`,
        }).then((res) => {
          console.log(res);
        });
        alert("Logged out successfully");
        navigate("/");
      };

      const home = () =>{
        navigate("/");
      }

    useEffect( () => {
        axios.get(`http://${REACT_APP_IP}:${REACT_APP_PORT}/user`, {
          withCredentials:true
        }).then((res) => {
          setData(res.data);
        })
        displayOutlines();
        console.log("admin refreshed");
    },[]);
      
    
    if(!data || !data.admin){
        return(
            <div className="home">
            <img src={logo} alt="Logo" />
            <h1>ECE COURSE OUTLINE MANAGER</h1>
            <br></br>
            <h2>You are not logged in</h2>
            <button onClick={async () => {
                home();
            }}>Back to Login</button>
            <br></br>
            <img id="AC" src={ac} alt="AmitChakma"/>
            </div>
        )
    }
    
    return(
        <div className="adminPage">
            <img src={logo} alt="Logo"/>
            <h1>ECE COURSE OUTLINE MANAGER</h1>
            <br></br>
            <h2>Add a Prof to a Course</h2>
            <br></br>
            <button id="selectProf" onClick={ () => {
                profSearch();
            }}>Search For Prof</button>
            <div id="profDiv" class="profClass">
            <input type="text" id="profName" placeholder="Prof" size="15" autoComplete="off" onInput={ () => {
                newProfInput();
            }}/>
            </div>
            <br className="break"></br>
            <button id="selectCourse" onClick={ () => {
                courseSearch();
            }}>Search For Course</button>
            <div id="courseDiv" class="courseClass">
            <input type="text" id="course" placeholder="Course Number" size="15" autoComplete="off" onInput={ () => {
                newCourseInput();
            }}/>
            </div>
            <br></br>
            <button onClick={() =>{
                assignProf(document.getElementById('selectProf').innerHTML, document.getElementById('selectCourse').innerHTML);
            }}>Assign Prof</button>
            <br></br>
            <h2>View Unapproved Outlines</h2>
            <button onClick={() => {
                displayOutlines();
                if(viewOutlines){
                    outlineView(false);
                    setView("View Course Outline");
                }
                else{
                    outlineView(true);
                    setView("Hide Course Outline");
                }
            }}>{view}</button>
            {
                viewOutlines &&
                <div>
                    <ul>{displayUnapproved}</ul>
                </div>
            }
            <br></br>

            <br></br>
            <h3>Logout</h3>
            <button onClick={async () => {
                logOut();
            }}>Back to Login</button>
            <br></br>
            <img id="AC" src={ac} alt="AmitChakma"/>
        </div>
    );
}

export default AdminPage