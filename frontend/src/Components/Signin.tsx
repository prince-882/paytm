import axios from 'axios';
import React, {  useRef, useState } from 'react'
import { Link,  useNavigate } from 'react-router';


const Signin = () => {
  const navigate = useNavigate()
  const emailref = useRef(null) as unknown as React.RefObject<HTMLInputElement>;
  const passwordref = useRef(null) as unknown as React.RefObject<HTMLInputElement>;
  const [message, Setmessage] = useState("");
  async function SignIn() {
    try {
    const data =  await axios.post("https://paytm-back.vercel.app/api/v1/user/signin/", {
        username: emailref.current.value,
        password: passwordref.current.value,
      })
   const jwt = data.data.token;
   localStorage.setItem("jwt", jwt);
   Setmessage("Sign In Successful , Redirecting...");
   navigate("/dashboard")
    } catch (error) {
      Setmessage("Sign In Failed, Please Check Your Credentials");
    }
  }
  
  return (
    <div className="h-screen w-screen flex  items-center justify-center bg-[#808080] py-16">
      <div className="flex flex-col py-7 h-fit  w-fit gap-3 items-center bg-white  rounded-xl ">
        <div>
          <h1 className="text-3xl font-bold text-center">Sign In</h1>
        </div>
        <span className="text-[#8a9196] mx-4 text-center font-semibold">
          Enter Your Information To Log In
        </span>
        <LabeledInput
          label="Email"
          type="email"
          placeholder="Enter your email"
          refer={emailref}
        />
        <LabeledInput
          label="Password"
          type="password"
          placeholder="Enter your password"
          refer={passwordref}
        />
        <button
          onClick={SignIn}
          className="bg-black cursor-pointer text-white  px-20 rounded-[8px] font-semibold py-2"
        >
          <span className="w-full">Sign Up</span>
        </button>
        <span className="text-sm font-semibold">
          Don't have an account?{" "}
          <Link className="underline" to={"/signup"}>
          Create One
          </Link>{" "}
        </span>
        <div className="mx-3">{message}</div>
      </div>
    </div>
 
  )
}


function LabeledInput(props: {
  label: string;
  type: string;
  placeholder: string;
  refer: React.RefObject<HTMLInputElement>;
}) {
  return (
    <div className="flex w-full px-7 gap-2 flex-col">
      <label className=" font-semibold">{props.label}</label>
      <input
        type={props.type}
        placeholder={props.placeholder}
        ref={props.refer}
        className="border text-[#8a9196] font-semibold border-gray-300 p-2 rounded-md"
      />
    </div>
  );
}

export default Signin
