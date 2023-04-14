import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, ContentState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useNavigate } from "react-router-dom";
import { REACT_APP_IP, REACT_APP_PORT } from "./config";



function CourseOutlineEditor() {

  const [course, setCourse] = useState([]);
  const [viewComment, commentView] = useState(false);
  const navigate = useNavigate();
  const id = window.dataA;

  const [editorState, setEditorState] = useState(() =>
    EditorState.createWithContent(ContentState.createFromText(window.dataO))
    , []);

  const back = () => {
    navigate("/Test");
  };

  async function displayComments() {
    axios.get(`http://${REACT_APP_IP}:${REACT_APP_PORT}/courseOutline/${id}`, {
      withCredentials: true
    }).then((res) => {
      setCourse(res.data[0].comments);
    })
  }

  const save = () => {
    let content = editorState.getCurrentContent().getPlainText();
    var currentdate = new Date();
    var formDateTime = "Last modified: " + currentdate.getDate() + "/"
      + (currentdate.getMonth() + 1) + "/"
      + currentdate.getFullYear() + " @ "
      + currentdate.getHours() + ":"
      + currentdate.getMinutes() + ":"
      + currentdate.getSeconds();
    console.log(formDateTime);
    axios({
      method: "PUT",
      data: {
        courseOutlineContent: content,
        currentDateTime: formDateTime,
      },
      withCredentials: true,
      url: `http://${REACT_APP_IP}:${REACT_APP_PORT}/outlines/${id}/update`,
    }).then((res) => {
      console.log(res);
    });
  };

  useEffect(() => {
    displayComments();
    console.log("hu")
  }, []);

  const commentMap = course?.map(data => (
    <h5>{data}</h5>
  ))


  return (
    <div className="main">
      <h1>EDIT COURSE OUTLINE</h1>
      <button onClick={async () => {

        if (!viewComment) {
          displayComments();
          console.log(course);
          commentView(true);
        }
        else {
          displayComments();
          console.log(course);
          commentView(false);
        }

      }}>View Comments</button>
      {
        viewComment &&
        <div>
          <ul id="usersList">{commentMap}</ul>
        </div>

      }
      <h2>Start Editing</h2>
      <div style={{ border: "1px solid purple", padding: '2px', margin: '50px', minHeight: '400px', backgroundColor: "white" }}>
        <Editor
          editorState={editorState}
          onEditorStateChange={setEditorState}
        />
      </div>
      <button onClick={async () => {
        back();
      }}>Back</button>
      <button onClick={async () => {
        save();
      }}>Save</button>
    </div>
  );
}
export default CourseOutlineEditor;
