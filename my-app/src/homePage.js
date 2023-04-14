import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from './assets/Faculty_Stacked.gif';
import ac from './assets/AmitChakma.jpg';
import axios from "axios";
import { REACT_APP_IP, REACT_APP_PORT } from "./config";

function HomePage() {

    const [data, setData] = useState(null); //data to determine wether user is logged in or not.
    const navigate = useNavigate();

    useEffect(() => { //loads on every webpage load.
        axios.get(`http://${REACT_APP_IP}:${REACT_APP_PORT}/user`, {
            withCredentials: true
        }).then((res) => {
            setData(res.data);
        })
    }, []);

    const prevCourse = () => {
        navigate("/PreviousCourseOutlines");
    };

    const newCourse = () => {
        navigate("/NewCourseOutline");
    };

    const gradAtt = () => {
        navigate("/GraduateAttributes")
    };

    const loginPage = () => {
        navigate("/");
    };

    const editOutline = () => {
        navigate("/Test");
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

    if (!data) {
        return (
            <div className="home">
                <img src={logo} alt="Logo" />
                <h1>ECE COURSE OUTLINE MANAGER</h1>
                <br></br>
                <h2>You are not logged in</h2>
                <button onClick={async () => {
                    loginPage();
                }}>Back to Login</button>
                <br></br>
                <img id="AC" src={ac} alt="AmitChakma" />
            </div>
        )
    }
    return (
        <div className="home">
            <img src={logo} alt="Logo" />
            <h1>ECE COURSE OUTLINE MANAGER</h1>
            <br></br>
            <div class="dhome1"><h2>View Previous Course Outlines</h2><h2>Create New Course Outline</h2></div>
            <div class="dhome">
                <button onClick={async () => {
                    prevCourse();
                }}>View Previous Course Outlines</button>
                <button onClick={async () => {
                    newCourse();
                }}>Create New Course Outline</button>
            </div>
            <br></br>
            <div class="dhome2"><h2>Edit Course Outline</h2><h2>Manage Graduate Attributes</h2></div>
            <div class="dhome3">
                <button onClick={async () => {
                    editOutline();
                }}>Edit a Course Outline</button>
                <button onClick={async () => {
                    gradAtt();
                }}>Manage Graduate Attributes</button>
            </div>
            <br></br>
            <h3>Logout</h3>
            <button onClick={async () => {
                logOut();
            }}>Logout</button>
            <br></br>
            <img id="AC" src={ac} alt="AmitChakma" />
        </div>
    );
}

export default HomePage;