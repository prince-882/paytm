import axios from "axios";
import React, {  useRef, useState } from "react";
import { Link, useNavigate } from "react-router";

const Signup = () => {
  const navigate = useNavigate()
  const emailref = useRef(null) as unknown as React.RefObject<HTMLInputElement>;
  const passwordref = useRef(
    null
  ) as unknown as React.RefObject<HTMLInputElement>;
  const firstnameref = useRef(
    null
  ) as unknown as React.RefObject<HTMLInputElement>;
  const lastnameref = useRef(
    null
  ) as unknown as React.RefObject<HTMLInputElement>;
  const [message, Setmessage] = useState("");
  async function SignUp() {
    try {
      const data = await axios.post("https://paytm-back.vercel.app/api/v1/user/signup/", {
        username: emailref.current.value,
        password: passwordref.current.value,
        firstname: firstnameref.current.value,
        lastname: lastnameref.current.value,
      });
      console.log(typeof data.data.message);
      
        Setmessage("User Created Successfully, Redirecting to Dashboard...");
      const jwt = data.data.token;
      localStorage.setItem("jwt", jwt);
      navigate("/dashboard")
    } catch (error) {
      Setmessage(" User Already Exists, Please Login");
    }
  }
  return (
    <div className="h-screen w-screen flex  justify-center bg-[#808080] py-16">
      <div className="flex flex-col py-7  gap-3 items-center bg-white  rounded-xl ">
        <div>
          <h1 className="text-3xl font-bold text-center">Sign Up</h1>
        </div>
        <span className="text-[#8a9196] mx-4 text-center font-semibold">
          Enter Your Information To Create An Account
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
        <LabeledInput
          label="First Name"
          type="text"
          placeholder="Enter your First Name"
          refer={firstnameref}
        />
        <LabeledInput
          label="Last Name"
          type="text"
          placeholder="Enter your Last Name"
          refer={lastnameref}
        />
        <button
          onClick={SignUp}
          className="bg-black cursor-pointer text-white  px-32 rounded-[8px] font-semibold py-2"
        >
          <span className="w-full">Sign Up</span>
        </button>
        <span className="text-sm font-semibold">
          Already Have An Account?{" "}
          <Link className="underline" to={"/signin"}>
            Login
          </Link>{" "}
        </span>
        <div className="mx-3">{message}</div>
      </div>
    </div>
  );
};
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

export default Signup;
