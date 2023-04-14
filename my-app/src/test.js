import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Collapsible from 'react-collapsible';
import { get } from "mongoose";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, ContentState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import 'draft-js/dist/Draft.css';
import EditCourseOutlineInterface from './editCourseOutlineInterface.js';
import { REACT_APP_IP, REACT_APP_PORT } from "./config.js";


function Test() {
    const [viewCourse, courseView] = useState(false);
    const [course, setCourse] = useState([]);
    const [view, setView] = useState("View Course Outline");
    const [getData, setData] = useState(null); //data to determine wether user is logged in or not.
    const navigate = useNavigate()
    let dataO;

    async function displayCourse() {

        const res = await fetch(`http://${REACT_APP_IP}:${REACT_APP_PORT}/isUser/${getData.email}`);
        const data = await res.json();
        setCourse([...course, ...data]);
    }

    useEffect(() => {
        axios.get(`http://${REACT_APP_IP}:${REACT_APP_PORT}/user`, {
            withCredentials: true
        }).then((res) => {
            console.log(res.data.email)
            setData(res.data);
        })
        console.log("hu")
    }, []);

    const edit = (data, courseId) => {
        window.dataO = data
        window.dataA = courseId
        navigate("/EditCourseOutlineInterface");
    };

    const home = () => {
        navigate("/Home");
    };

    const expand = (data, courseID) => {
        return (
            <Collapsible trigger="Expand">

                <pre>
                    {data}
                </pre>
                <button onClick={async () => {
                    edit(data, courseID);
                }}>Edit</button>
            </Collapsible>
        );
    };

    const submitOutline = (id) => {
        axios({
            method: "PUT",
            data: {
                isSubmit: true,
            },
            withCredentials : true,
            url: `http://${REACT_APP_IP}:${REACT_APP_PORT}/outlines/${id}/submit`,
        }).then((res) => {
            console.log(res);
        });
        alert(`Outline ${id} has been submitted`);
    }


    const outlineMap = course.map(data => (
        <li>
            <div className="CA">
                <h3>{data.courseOutlineID}{"\n"}{data.class}</h3>
                <button onClick={() => {submitOutline(data.courseOutlineID);}}>Submit for review</button>
                {expand(data.courseOutlineContent, data.courseOutlineID)}
                <h5>{data.currentDateTime}{"\n"}{data.userID}</h5>
            </div>
        </li>

    ))


    return (
        <div className="main" style={{ backgroundColor: "lightgrey" }}>
            <h1>EDIT COURSE OUTLINES</h1>
            <button onClick={async () => {

                if (!viewCourse) {
                    displayCourse()
                    courseView(true);
                    setView("Hide Course Outlines");
                }
                else {
                    setCourse([]);
                    courseView(false);
                    setView("View Course Outlines");
                }

            }}>{view}</button>
            {
                viewCourse &&
                <div>
                    <ul id="usersList">{outlineMap}</ul>
                </div>

            }
            <br></br>
            <button onClick={async () => {
                home();
            }}>Home</button>
        </div>

    );
}

export default Test;
