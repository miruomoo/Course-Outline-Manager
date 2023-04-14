import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, ContentState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import logo from './assets/Faculty_Stacked.gif';
import ac from './assets/AmitChakma.jpg';
import { REACT_APP_IP, REACT_APP_PORT} from "./config";

function NewCourseOutline() {
    
    const [stateCourseName, courseNameState] = useState("");
    const [outlineClass, setClass] = useState("");
    const [data, setData] = useState(null); //data to determine wether user is logged in or not.
    const [viewSelect, selectView] = useState(false);
    const navigate = useNavigate();

    const home = () => {
        navigate("/Home");
    };
   
    const saveCourseOutline = () => {
        // Var of the current content
        let content =  editorState.getCurrentContent().getPlainText();
        var currentdate = new Date();
        var formDateTime = "Date Created: " + currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
        console.log(stateCourseName)
        console.log(content)
        axios({
          method: "POST",
          data: {
            courseOutlineID: stateCourseName,
            courseOutlineContent: content,
            currentDateTime: formDateTime,
            userID: data.email,
            isApproved: false,
            isSubmit: false,
            class: outlineClass
          },
          withCredentials: true,
          url: `http://${REACT_APP_IP}:${REACT_APP_PORT}/newCourseOutline/new`,
        }).then((res) => {
          console.log(res)
        })
    }

    const createGraduateAttributes = () => {
        for (let i = 1; i<=12; i++){
            axios({
                method: "POST",
                data: {
                    id: `${i}`,
                    lo: "",
                    ass: "",
                    courseID: stateCourseName
                },
                withCredentials: true,
                url: `http://${REACT_APP_IP}:${REACT_APP_PORT}/newCourseOutline/ga`,
              }).then((res) => {
                console.log(res)
              })
        }
    }


    const loginPage = () => {
        navigate("/");
    };


    const [editorState, setEditorState] = useState(() =>
       EditorState.createWithContent(ContentState.createFromText("Western University \n Faculty of Engineering \n Department of Electrical and Computer Engineering \n ECE XXXXA/B: Course Title \n Course Outline 20YY-YY \n Description: \n Instructor:	Dr. Name, P.Eng. \n TEB XXX, 519-661-2111 ext. XXXXX, UWO e-mail address as hyperlink \n Consultation hours: \n\nAcademic Calendar Copy:  \n Contact Hours: X lecture hours, Y laboratory hours, Z tutorial hours, 0.5 course.\n Antirequisite: \n Prerequisites: \n Co-requisite: \n Unless you have either the requisites for this course or written special permission from your Dean to enroll in it, you will be removed from this course and it will be deleted from your record. This decision may not be appealed. You will receive no adjustment to your fees in the event that you are dropped from a course for failing to have the necessary prerequisites.\n\n CEAB Academic Units: Engineering Science X%, Engineering Design Y%.\n\n Required Textbook: \n\n Other Required References: \n Recommended References: \n General Learning Objectives (CEAB Graduate Attributes)\n Knowledge Base x \n Use of Engineering Tools x\n Impact on Society and the Environment x \n Problem Analysis x \n Individual and Team Work x \n Ethics and Equity x\n Investigation x\n Communication Skills x \n Economics and Project Management x \n Design x\n Professionalism x\n Life-Long Learning x  \n Notation: where x be I: Introductory, D: Intermediate, A: Advanced, or empty. I - The instructor will introduce the topic at the level required.  It is not necessary for the student to have seen the material before. D – There may be a reminder or review, but the student is expected to have seen and been tested on the material before taking the course. A – It is expected that the student can apply the knowledge without prompting (e.g. no review).\n \n Course Topics and Specific Learning Outcomes \n CEAB Graduate Attributes Indicators  \n 1.	Topic 1 \n \n At the end of this section, students will be able to:\n\n a.  \n\n b.  \n 2.	Topic 1  \n\n At the end of this section, students will be able to:\n\n a.\n\n b. \n 3.	Topic 1\n\n At the end of this section, students will be able to:  \n\n a. \n\n b.\n 4.	Topic 1\n\n At the end of this section, students will be able to:\n\n a. \n\n b.   \n\n\n\n Evaluation\n Course Component\n Weight\n Homework Assignments %\n Quizzes %\n Laboratory %\n Midterm Test % \n Final Examination 50%\n To obtain a passing grade in the course, a mark of 50% or more must be achieved on the final examination as well as on the laboratory. A final examination or laboratory mark < 50% will result in a final course grade of 48% or less.\n Homework Assignments:  \n Quizzes:  \n Laboratory: \n Midterm Test: \n Final Examination: The final examination will be take place during the regular examination period. \n\nLate Submission Policy: \n\n Assignment Submission Locker: Locker XYZ located on the second floor of TEB.\n\n Use of English: In accordance with Senate and Faculty Policy, students may be penalized up to 10% of the marks on all assignments, tests, and examinations for improper use of English. Additionally, poorly written work with the exception of the final examination may be returned without grading. If resubmission of the work is permitted, it may be graded with marks deducted for poor English and/or late submission.\n\n Attendance: Any student who, in the opinion of the instructor, is absent too frequently from class, laboratory, or tutorial periods will be reported to the Dean (after due warning has been given). On the recommendation of the department, and with the permission of the Dean, the student will be debarred from taking the regular final examination in the course. \n\n Absence Due to Illness or Other Circumstances: Students should immediately consult with the instructor or department Chair if they have any problems that could affect their performance in the course. Where appropriate, the problems should be documented (see the attached “Instructions for Students Unable to Write Tests or Examinations or Submit Assignments as Scheduled”). The student should seek advice from the instructor or department Chair regarding how best to deal with the problem. Failure to notify the instructor or department Chair immediately (or as soon as possible thereafter) will have a negative effect on any appeal.\n\n For more information concerning medical accommodations, see the relevant section of the Academic Handbook:\nwww.uwo.ca/univsec/pdf/academic_policies/appeals/accommodation_medical.pdf\n\n For more information concerning accommodations for religious holidays, see the relevant section of the Academic Handbook:\n www.uwo.ca/univsec/pdf/academic_policies/appeals/accommodation_religious.pdf\n\n Missed Midterm Examinations: If a student misses a midterm examination, she or he must follow the Instructions for Students Unable to Write Tests and provide documentation to Undergraduate Services Office within 24 hours of the missed test. If accommodation is granted, the department will decide whether to provide a make-up test or allow reweighting of the test, where reweighting means the marks normally allotted for the midterm will be added to the final exam. If no reasonable justification for missing the test can be found, then the student will receive a mark of zero for the test.\n\n If a student is going to miss the midterm examination for religious reasons, they must inform the instructor in writing within 48 hours of the announcement of the exam date or they will be required to write the exam.  \n\n Cheating and Plagiarism: Students must write their essays and assignments in their own words. Whenever students take an idea or a passage from another author, they must acknowledge their debt both by using quotation marks where appropriate and by proper referencing such as footnotes or citations. University policy states that cheating, including plagiarism, is a scholastic offence. The commission of a scholastic offence is attended by academic penalties, which might include expulsion from the program. If you are caught cheating, there will be no second warning.\n\n All required papers may be subject to submission for textual similarity review to commercial plagiarism-detection software under license to the University for the detection of plagiarism. All papers submitted will be included as source documents on the reference database for the purpose of detecting plagiarism of papers subsequently submitted to the system. Use of the service is subject to the licensing agreement, currently between the University of Western Ontario and Turnitin.com (www.turnitin.com).\n\n Scholastic offences are taken seriously and students are directed to read the appropriate policy, specifically, the definition of what constitutes a Scholastic Offence, in the relevant section of the Academic Handbook:\n www.uwo.ca/univsec/pdf/academic_policies/appeals/scholastic_discipline_undergrad.pdf\n\n Use of Electronic Devices: \n\n Use of Personal Response Devices (Clickers): \n\n Policy on Repeating All Components of a Course: Students who are required to repeat an Engineering course must repeat all components of the course. No special permissions will be granted enabling a student to retain laboratory, assignment, or test marks from previous years. Previously completed assignments and laboratories cannot be resubmitted by the student for grading in subsequent years.\n\n Internet and Electronic Mail: Students are responsible for regularly checking their Western email and the course web site (owl.uwo.ca/portal/) and making themselves aware of any information that is posted about the course.\n\n Accessibility: Please contact the course instructor if you require material in an alternate format or if any other arrangements can make this course more accessible to you. You may also wish to contact Services for Students with Disabilities (SSD) at 519-661-2111 ext. 82147 for any specific question regarding an accommodation.\n\n Support Services:	\n Office of the Registrar, www.registrar.uwo.ca/\n Student Development Centre,www.sdc.uwo.ca/\n Engineering Undergraduate Services, www.eng.uwo.ca/undergraduate/\n USC Student Support Services, westernusc.ca/services/\n Students who are in emotional/mental distress should refer to Mental Health @ Western, www.health.uwo.ca/mental_health/, for a complete list of options about how to obtain help."))
       , []);

    useEffect(() => {
        console.log(editorState);
        axios.get(`http://${REACT_APP_IP}:${REACT_APP_PORT}/user`, {
          withCredentials:true
        }).then((res) => {
          setData(res.data);
        })
    }, [editorState]);

    if(!data){
        return(
            <div className="home">
            <img src={logo} alt="Logo" />
            <h1>ECE COURSE OUTLINE MANAGER</h1>
            <br></br>
            <h2>You are not logged in</h2>
            <button onClick={async () => {
                loginPage();
            }}>Back to Login</button>
            <br></br>
            <img id="AC" src={ac} alt="AmitChakma"/>
            </div>
        )
    }
    return (
        <div className="main">
            <h1>NEW COURSE OUTLINE TEMPLATE</h1>
            <h2>Start Editing</h2>
            <input placeholder='Course Outline Name' onChange={e => courseNameState(e.target.value)} />
            <select id="selectClass" onChange={e => setClass(e.target.value)}>
                {data.courseName.map((option) => {
                    return (<option key={option} value={option}>{option}</option>);
                })}
            </select>
                  
            <div style={{ border: "1px solid purple", padding: '2px', margin: '50px', minHeight: '400px', backgroundColor: "white" }}>
                <Editor
                    editorState={editorState}
                    onEditorStateChange={setEditorState}
                />
            </div>
            <button onClick={async () => {
                saveCourseOutline();
                createGraduateAttributes();
            }}>Save course outline</button>
            <button onClick={async () => {
                home();
            }}>Home</button>
        </div>
    );
}
export default NewCourseOutline;
