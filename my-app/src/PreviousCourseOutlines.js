import React from "react";
import jsPDF from 'jspdf';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Collapsible from 'react-collapsible';
import { REACT_APP_IP, REACT_APP_PORT } from "./config";
import axios from "axios";

function PreviousCourseOutlines() {
    const [viewCourse, courseView] = useState(false);
    const [course, setCourse] = useState([]);
    const [view, setView] = useState("View Course Outline");
    const [isExpanded, setIsExpanded] = useState(false);
    const [data, setData] = useState(null);
    const navigate = useNavigate()

    const downPDF = (courseOutlineContent) => {
        const doc = new jsPDF();
        const fontSize = 12;
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
        const maxContentHeight = pageHeight - 20;

        const contentLines = doc.splitTextToSize(courseOutlineContent, pageWidth - 20);
        console.log("contentLines:", contentLines);

        let pageContent = contentLines.slice(0, maxContentHeight / fontSize);
        let remainingContent = contentLines.slice(maxContentHeight / fontSize);

        doc.setFontSize(fontSize);
        doc.text(pageContent, 10, 10);

        while (remainingContent.length > 0) {
            doc.addPage();
            pageContent = remainingContent.slice(0, maxContentHeight / fontSize);
            remainingContent = remainingContent.slice(maxContentHeight / fontSize);
            doc.setFontSize(fontSize);
            doc.text(pageContent, 10, 10);
        }
        doc.save('my-pdf.pdf');
    }

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };

    async function displayCourse() {
        const res = await fetch(`http://${REACT_APP_IP}:${REACT_APP_PORT}/isApproved`);
        const data2 = await res.json(); //All approved classes
        let courses = []
        console.log(`user: ${data.email}`)

        for (let i = 0; i < data.courseName.length; i++) {
            console.log(`data: ${data.courseName[i]}`)
            //if user's courseName is equivalent to the approved class' course code add to array
            var found = (data2.filter(function (item) { return item.class === data.courseName[i] }));
            courses.push(...found);
        }
        console.log(courses);
        //to make sure the array doesnt get populated multiple times
        if (course.length < 1) {
            setCourse([...course, ...courses]);
        }
    }

    useEffect(() => {
        axios.get(`http://${REACT_APP_IP}:${REACT_APP_PORT}/user`, {
            withCredentials: true
        }).then((res) => {
            setData(res.data);
        });
        //displayCourse();
    }, []);


    const home = () => {
        navigate("/Home");
    };

    const expand = (data) => {
        return (
            <Collapsible trigger="Expand">
                <pre>
                    {data}
                </pre>
            </Collapsible>
        );
        // return (
        //     <div>
        //       <button onClick={handleToggle}>
        //         {isExpanded ? 'Collapse' : 'Expand'}
        //       </button>
        //       <Collapsible trigger="" open={isExpanded}>
        //         <pre>{data}</pre>
        //       </Collapsible>
        //     </div>
        //   );
        // };
    };


    const outlineMap = course.map(data1 => (
        <li key={data1.courseOutlineID}>
            <div className="CA">
                <h3>
                    {data1.courseOutlineID}{"\n"}{data1.class}{"\n"}
                    <button onClick={() => downPDF(data1.courseOutlineContent)}>Download PDF</button>
                </h3>
                {expand(data1.courseOutlineContent, data1.courseOutlineID)}
                <h5>{data1.currentDateTime}{"\n"}{`Published by: ${data1.userID}`}</h5>
            </div>
        </li>

    ))


    return (
        <div className="main" style={{ backgroundColor: "lightgrey" }}>
            <h1>COURSE OUTLINES</h1>
            <h2>ECE 3375</h2>
            <button onClick={async () => {

                if (viewCourse) {
                    displayCourse();
                    courseView(false);
                    setView("View Course Outlines");
                }
                else {
                    displayCourse();
                    courseView(true);
                    setView("Hide Course Outlines");
                }

                // console.log(viewCourse);
                // console.log(course);
                // for (var i = 0; i < course.length; i++) {
                //     console.log(course[i].courseOutlineContent);
                // }

            }}>{view}</button>
            {
                viewCourse &&
                <div id="prevCourses">
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

export default PreviousCourseOutlines;