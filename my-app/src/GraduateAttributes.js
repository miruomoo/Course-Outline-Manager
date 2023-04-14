import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, ContentState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { REACT_APP_IP, REACT_APP_PORT } from "./config";

function GraduateAttributes() {
  const navigate = useNavigate()
  const [data, setData] = useState(null); //data to determine wether user is logged in or not.
  const [gradAttribute, setGradAtt] = useState("");
  const [classArr, setClassArr] = useState([]);
  const [outlineClass, setClass] = useState();
  let counter = 0;
  const home = () => {
    navigate("/Home");
  };
  const [editorState, setEditorState] = useState(() =>
    EditorState.createWithContent(ContentState.createFromText("Indicate grading assessment for selected Graduate Attribute"))
    , []);

  async function displayCourse() {
    axios.get(`http://${REACT_APP_IP}:${REACT_APP_PORT}/isUser/${data.email}`, {
      withCredentials: true
    }).then((res) => {
      setClassArr(res.data);
    })
  }


  useEffect(() => {
    
    //loads on every webpage load.
    axios.get(`http://${REACT_APP_IP}:${REACT_APP_PORT}/user`, {
      withCredentials: true
    }).then((res) => {
      setData(res.data);
      clearGA()
    });
    }, []);

  if (!data) {
    navigate("/Home");
  };

  if (data && classArr.length < 1){
    displayCourse();
  }

  const linkLearnObj = () => {
    let show = document.getElementById("div2")
    while (show.firstChild) {
      show.removeChild(show.firstChild);
    }
    let gradAtt = document.getElementById("gradAtt").value;
    let learnObj = document.getElementById("learnObj").value;
    alert("Learning Objective Linked!")
    show.appendChild(document.createTextNode("Updated Learning Objective: " + learnObj))
    axios({
      method: "PUT",
      url: `http://${REACT_APP_IP}:${REACT_APP_PORT}/gradAtt/${gradAtt}/${learnObj}/${outlineClass}/update`
    }).then((res) => {
      console.log(res)
    })
  }

  const saveGradAss = () => {
    // Update grading assessment
    let gradAtt = document.getElementById("gradAtt").value;
    let content = editorState.getCurrentContent().getPlainText();
    alert("Grading Assessment Saved!")
    axios({
      method: "PUT",
      data: {
        ass: content
      },
      withCredentials: true,
      url: `http://${REACT_APP_IP}:${REACT_APP_PORT}/gradAtt/${gradAtt}/${outlineClass}/updateGA`,
    }).then((res) => {
      console.log(res)
    })
  }

  async function clearGA() {
    let show = document.getElementById("div2")
    while (show.firstChild) {
      show.removeChild(show.firstChild);
    }
    let gradAtt = document.getElementById("gradAtt").value;
    axios.get(`http://${REACT_APP_IP}:${REACT_APP_PORT}/gradAtt/${gradAtt}/${outlineClass}`, {
      withCredentials: true
    }).then((res) => {
      setGradAtt(res.data[0]);
    })
  }

  async function changeGA() {
    let show = document.getElementById("div2")
    while (show.firstChild) {
      show.removeChild(show.firstChild);
    }
    show.appendChild(document.createTextNode("Current Learning Objective: " + gradAttribute.lo))
    show.appendChild(document.createElement("br"))
    show.appendChild(document.createTextNode(" Grading Assessment: " + gradAttribute.ass))
    show.appendChild(document.createElement("br"))
  }

  return (
    <div className="main" style={{ backgroundColor: "lightgrey" }}>
      <h1>MANAGE GRADUATE ATTRIBUTES</h1>
      <br></br>
      <h2>Select Course:</h2>
      <select id="selectClass" onChange={e => {setClass(e.target.value); clearGA()}}>
        {classArr.map((option) => {
          return (<option key={option.courseOutlineID} value={option.courseOutlineID}>{option.courseOutlineID}</option>);
        })}
      </select>
      <h2>Link Learning Objectives</h2>
      <div id="d1">
        <div>
          <h3>Learning Objective</h3>
          <input id="learnObj" placeholder="Enter Learning Objective"></input>
        </div>
        <h3 style={{ marginTop: "55px", marginLeft: "45px", marginRight: "0px" }}>🔗</h3>
        <div>
          <h3>Graduate Attribute</h3>
          <select id="gradAtt" onChange={async () => {
            clearGA();
          }
          }>
            <option value="1">Knowledge Base</option>
            <option value="2">Problem Analysis</option>
            <option value="3">Investigation</option>
            <option value="4">Design</option>
            <option value="5">Use of Engineering Tools</option>
            <option value="6">Individual and Team Work</option>
            <option value="7">Communication Skills</option>
            <option value="8">Professionalism</option>
            <option value="9">Impact of Engineering on Society and the Environment</option>
            <option value="10">Ethics and Equity</option>
            <option value="11">Economics and project management</option>
            <option value="12">Life-long Learning</option>
          </select>
        </div>
      </div>
      <div id="div2"></div>
      <button onClick={async () => {
        linkLearnObj();
        clearGA();
        clearGA();
      }}>Link To Graduate Attribute</button>
      <button onClick={async () => {
        changeGA();
      }}>VIEW</button>
      <h2>Indicate Assessment</h2>
      <div style={{ border: "1px solid purple", padding: '2px', margin: '50px', minHeight: '400px', backgroundColor: "white" }}>
        <Editor
          editorState={editorState}
          onEditorStateChange={setEditorState}
        />
      </div>
      <button onClick={async () => {
        saveGradAss();
        clearGA();
        clearGA();
      }}>Save Grading Assessment</button>
      <button onClick={async () => {
        home();
      }}>Home</button>
    </div>
  );
}
export default GraduateAttributes;