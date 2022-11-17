import React from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';
import {useState, useEffect} from "react";
import axios from 'axios';
import ProgressBar from '../../subcomponents/ProgressBar.jsx';


const initialValues = {
  username:"",
  password:"",
  confirmpassword:""

}

let checkPassword = false;
let checkUsername = false;
let checkConfirmPassword = false;





export default function SplashModal({isShowing, hide, setBank, setUser}) {


  const [signup, setSignup] = useState(false);
  const [login, setLogin] = useState(false);

  const [currentInput, setInput] = useState(initialValues);



  var userObject = {
    password: currentInput.password,
    name: currentInput.username,

  }

  var handleInputChange = (e) => {
    const {name, value} = e.target;

    if(name === 'username') {
      if(e.target.value.length === 0){
        e.target.setAttribute('aria-valid','inValid')
        checkUsername = false;
      }
      if(e.target.value.length >= 1){
        e.target.setAttribute('aria-valid','valid')
        checkUsername = true;

      }
      if(e.target.value.length >= 60){
        e.target.setAttribute('aria-valid','inValid')
        checkUsername = false;
      }
    }
    if(name === 'password') {
      if(value.length === 0){
        e.target.setAttribute('aria-valid','inValid')
        checkPassword = false;
      }
      if(value.length >= 1){
        e.target.setAttribute('aria-valid','valid')
        checkPassword = true;
      }
      if(value.length >= 100){
        e.target.setAttribute('aria-valid','inValid')
        checkPassword = false;
      }
    }
    if(name === 'confirmpassword') {
      if(currentInput.password === 0) {
        e.target.setAttribute('aria-valid','inValid')
        checkConfirmPassword = false;
      } else {
        if(value === currentInput.password) {
          console.log('hello')
          e.target.setAttribute('aria-valid','valid')
          checkConfirmPassword = true;
        }
      }


    }

    setInput({
      ...currentInput,
      [name]: value
    })
  }

  var submitSignUp = () => {
    event.preventDefault();

    if(!(checkPassword&&checkUsername&&checkConfirmPassword)){
      if(!checkPassword) {
        alert('Please provide a valid Password')
        return;
      }
      alert('Please make sure your password is the same in both fields.')
      return;
    }




    axios.post('/signup',userObject)
      .then((result) => {
        console.log('user', result)
        setInput(initialValues);
        setBank(500);
        setUser(currentInput.username);
        hide();
      })
      .catch((error) => {
        console.log('failed', error)
      })
  }

  var submitLogIn = () => {
    event.preventDefault();

    axios.post('/login',userObject)
      .then((result) => {
        console.log(result)
        if(result.status === 204) {
          alert('User log in failed.')
          return;
        }
        setUser(result.data.name);
        setBank(result.data.currentBank);
        hide();
      })
      .catch((error) => {
        console.log('failed', error)
      })


  }



  if(isShowing) {
    return ReactDOM.createPortal(
      <>
      <div className="modal-overlay"/>
      <div className="modal-wrapper" aria-modal aria-hidden tabIndex={-1} role="dialog">
        <div className="modal">
          <div className="modal-header">
          </div>
          {signup === false && login === false ? <div>
            <button onClick={(e) => {e.preventDefault(); setSignup(true);}}>Sign Up</button>
            <button onClick={(e) => {e.preventDefault(); setLogin(true);}}>Log In</button>
          </div> : null}
          {signup === true ? <div>
            <form>
            <div id="USERNAMEDIV">
                <div>
                  <span>Username</span>
                </div>
                <textarea
                type="text"
                name="username"
                className="QANDA"
                id="USERNAMEOFINPUT"
                autoComplete="off"
                value={currentInput.name}
                onChange={handleInputChange}

                ></textarea>
                <div>
                  <span>This will display to all other players and be used as your login.</span>
                </div>
            </div>
            <div id="PASSWORDDIV">
                <div>
                  <span>Password</span>
                </div>
                <textarea
                type="password"
                name="password"
                className="QANDA"
                id="PASSWORDINPUT"
                autoComplete="off"
                value={currentInput.name}
                onChange={handleInputChange}

                ></textarea>
                <div>
                  <span>Must be over 16 characters.</span>
                </div>
            </div>
            <div id="CONFIRMPASSWORDDIV">
                <div>
                  <span>Confirm Password</span>
                </div>
                <textarea
                type="password"
                name="confirmpassword"
                className="QANDA"
                id="CONFIRMPASSWORDINPUT"
                autoComplete="off"
                value={currentInput.name}
                onChange={handleInputChange}

                ></textarea>
                <div>
                  <span>Passwords must match.</span>
                </div>
            </div>
            <button id="submitButton"onClick={submitSignUp}>Sign up!</button>
            </form>
          </div> : null}
          {login === true ? <div>
              <form>
                <div id="USERNAMEDIV">
                  <div>
                    <span>Username</span>
                  </div>
                  <textarea
                  type="text"
                  name="username"
                  className="QANDA"
                  id="USERNAMEOFINPUT"
                  autoComplete="off"
                  value={currentInput.name}
                  onChange={handleInputChange}

                  ></textarea>
                  <div>
                    <span>This will display to all other players and be used as your login.</span>
                  </div>
                </div>
                <div id="PASSWORDDIV">
                  <div>
                    <span>Password</span>
                  </div>
                  <textarea
                  type="password"
                  name="password"
                  className="QANDA"
                  id="PASSWORDINPUT"
                  autoComplete="off"
                  value={currentInput.name}
                  onChange={handleInputChange}

                  ></textarea>
                  <div>
                    <span>Must be over 16 characters.</span>
                  </div>
                </div>
                <button id="submitButton"onClick={submitLogIn}>Log In!</button>
              </form>
            </div> : null}
        </div>
      </div>
    </>, document.body
    )
  } else {
    return null;
  }
}