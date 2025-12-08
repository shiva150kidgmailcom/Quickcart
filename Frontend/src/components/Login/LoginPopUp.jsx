import React, { useContext, useState } from "react";
import style from "./loginPopUp.module.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios"

const LoginPopUp = ({ setShowLogin }) => {
  const [currState, setCurrState] = useState("Login");


  const { URl, setToken } = useContext(StoreContext)

  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  })

  const onChangehandler = (event) => {
    const name = event.target.name
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }))
  }

  const onLogin = async (event) => {
    event.preventDefault();

    let newURl = URl

    if (currState === "Login") {
      newURl += "/api/user/login"
    } else {
      newURl += "/api/user/register"
    }

    const response = await axios.post(newURl, data)

    if (response.data.success) {
      setToken(response.data.token)
      localStorage.setItem("token", response.data.token)
      setShowLogin(false)
    } else {
      alert(response.data.message)
    }

  }

  return (
    <div className={style.LoginPopUp}>
      <form onSubmit={onLogin} className={style.LoginPopUpContainer}>
        <div className={style.LoginPopUpTitle}>
          <h2>{currState}</h2>
          <img
            src={assets.cross_icon}
            alt=""
            onClick={() => {
              setShowLogin(false);
            }}
          />
        </div>
        <div className={style.LoginPopUpInputs}>
          {currState === "Login" ? (
            <></>
          ) : (
            <input type="text" name="name" onChange={onChangehandler} value={data.name} placeholder="Your Name" required />
          )}
          <input type="email" placeholder="Your Email" name="email" onChange={onChangehandler} value={data.email} required />
          <input type="password" placeholder="Your Password" name="password" onChange={onChangehandler} value={data.password} required />
        </div>
        <button type="submit">{currState === "Sign Up" ? "Create Account" : "Login"}</button>
        <div className={style.LoginPopUpConditon}>
          <input type="Checkbox" required />
          <p>I agree to the terms and conditions</p>
        </div>
        {currState === "Login" ? (
          <p>
            If you don't have an account, <span onClick={() => setCurrState("Sign Up")}>Click Here To Create</span>
          </p>
        ) : (
          <p>
            Already Have an Account? <span onClick={() => setCurrState("Login")}>Login Here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopUp;
