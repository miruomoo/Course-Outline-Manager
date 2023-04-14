import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import axios from "axios"
import logo from './assets/Faculty_Stacked.gif'
import ac from './assets/AmitChakma.jpg'
import { REACT_APP_IP, REACT_APP_PORT} from "./config";


function LoginUser() {
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [reg, setReg] = useState("Register");
  const [data, setData] = useState(null);
  const [registerDiv, setRegisterDiv] = useState(false);
  const [show, setShow] = useState(false)

  
  //this adds a state (memory) to a component.
  //State updates based on previous state, sotres info from previous renders and avoids recreating initial state.

  useEffect( () =>{ //loads on every webpage load.
    axios.get(`http://${REACT_APP_IP}:${REACT_APP_PORT}/user`, {
      withCredentials:true
    }).then((res) => {
      setData(res.data);
    })
  },[]);

  const navigate = useNavigate();

  //email verification function
  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleShow = () => {
    setShow(!show)
  }

  const register = () => {

    if(!validateEmail(registerEmail)){
      alert("ERROR: Invalid email format or Enter an email");
      window.location.reload();
    }
    else if(registerPassword === ""){
      alert("ERROR: Enter a password!");
      window.location.reload();
    }
    else{
      axios({
        method: "POST",
        data: {
          email: registerEmail,
          password: registerPassword,
          admin: false,
        },
        withCredentials: true,
        url: `http://${REACT_APP_IP}:${REACT_APP_PORT}/register`,
      }).then((res) => {
        console.log(res);
        setRegisterDiv(false); //this hides the register div
        setReg("Register"); //chnages the text of the button
      });
    }
  };
  //axios is a promise based HTTP client library

  //login method
  const login = async() => {
    console.log(data);
    if(loginPassword === ""){
      alert("ERROR: Enter a password");
      window.location.reload();
    }
    else{
    axios({
      method: "POST",
      data: {
        email: loginEmail,
        password: loginPassword
      },
      withCredentials: true,
      url: `http://${REACT_APP_IP}:${REACT_APP_PORT}/login`,
    }).then((res) => {//.then occurs when the backend function works
        console.log(res)
        navigate("/home");
    }).catch((res) => {//.then occurs when the backend function fails
        console.log(res)
        alert("Credentials incorrect");
    });
  }
  };

  //login method for admins, very similar to login method for regular users however is redirects to a different page.
  const adminLogin = async() => {
    if(loginPassword === ""){
      alert("ERROR: Enter a password");
      window.location.reload();
    }
    else{
    axios({
      method: "POST",
      data: {
        email: loginEmail,
        password: loginPassword
      },
      withCredentials: true,
      url: `http://${REACT_APP_IP}:${REACT_APP_PORT}/login`,
    }).then((res) => {
        console.log(res)
        navigate("/admin");
    }).catch((res) => {
        console.log(res)
        alert("Credentials incorrect")
    });
  }
  };

  //Logout method
  const logOut = () => {
    axios({
      method: "POST",
      withCredentials: true,
      url: `http://${REACT_APP_IP}:${REACT_APP_PORT}/logout`,
    }).then((res) => {
      console.log(res);
    });
    alert("Logged out successfully");
    window.location.reload();
  };

  //data can distinguish if a user is logged in or not. We can return different web pages based on the user status. 
  //!data will return the webpage if the user is not logged in
  if(!data){
  return (
    <div className="App">

        <img src={logo} alt="Logo" />
        <h1>ECE COURSE OUTLINE MANAGER</h1>
        <br></br>

        <div>
            <h1>Login</h1>
            <input class='login' placeholder='email' onChange={e => setLoginEmail(e.target.value)} /> 
            <br className="break"></br>
            <div className="container">
              <input class='login' type={show?"text":"password"}placeholder='password' onChange={e => setLoginPassword(e.target.value)} />
              <label onClick={handleShow}>{show?"Hide":"Show"}</label>
            </div>
            <br className="break"></br>
            <button onClick={login}>Submit</button>
            <button onClick={adminLogin}>Admin?</button>
        </div>
        
        <div>
            <h3>No Account? Register here</h3>
            <button onClick={ () =>{ //This is an inline function in react
              if(!registerDiv){
              setRegisterDiv(true);
              setReg("Hide")}
              
              else{
              setRegisterDiv(false);
              setReg("Register")
              }}
            }>{reg}</button>
            {registerDiv && //this is an if statement in react, so when registerDiv is true it displays the contents within the brackets
            <div>
            <h1>Register</h1>
            <input placeholder='email' onChange={e => setRegisterEmail(e.target.value)} />
            <br className="break"></br>
            <input placeholder='password' onChange={e => setRegisterPassword(e.target.value)} />
            <br className="break"></br>
            <button onClick={register}>Submit</button>
            </div>
            }
            
        </div>

        <br></br>
        <img id="AC" src={ac} alt="AmitChakma"/>

    </div>
  );
  }

  //If the user is logged in (there is no real reason for the user to be on the login page while logged in but just in case)
  return (
    <div className="App">

        <img src={logo} alt="Logo" />
        <h1>ECE COURSE OUTLINE MANAGER</h1>
        <br></br>

        <h2>Are you sure you want to logout?</h2>
        
        <button onClick={logOut}>logout</button>

        <br></br>
        <img id="AC" src={ac} alt="AmitChakma"/>

    </div>
  );

}

export default LoginUser;