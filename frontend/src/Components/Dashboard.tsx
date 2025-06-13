import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, {  useEffect, useState } from "react";
import { Link } from "react-router";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [balance, setBalance] = useState(0)
  const token = localStorage.getItem("jwt");
  
 if(!token) {
  return(
    <>
    <div className=" m-3 text-4xl font-semibold">No  Account Found</div>
    <Link to={"/signin"}><span className="bg-gray-300 underline p-2 rounded-[5px] m-4 ">Login</span></Link>
    <Link to={"/signup"}><span className="bg-green-300 rounded-[5px] p-2 underline">Signup</span></Link>
    </>
  )
 }
 const decoded : any = jwtDecode(token)
 interface User {
   _id:string;
   firstname: string;
   lastname: string;
   username: string;
 }
  async function GetUsers(e: React.ChangeEvent<HTMLInputElement>) {
    const data = await axios.get("https://paytm-backend-steel.vercel.app/api/v1/user/bulk/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        firstname: e.target.value,
      },
    });
    setUsers(data.data.users.filter((item:User) => item._id!== decoded.userId ));
  }
  useEffect(() => {
  axios.get("https://paytm-backend-steel.vercel.app/api/v1/account/balance",
    {
      headers:{
        Authorization:`Bearer ${token}`
      }
    }
  ).then(res=>{
    setBalance(res.data.balance)
    console.log(res);
    
  })  
  
  }, [balance])
  
  return (
    <div className=" px-6 w-screen  bg-white">
      <div className="topbar mt-5 flex flex-row justify-between">
        <h1 className="text-3xl text-black font-bold">Payments App</h1>
        <span className="text-2xl flex items-center ">
          {" "}
          Hello, User <img
            src="/user.png"
            className=" ml-2.5 h-12"
            alt=""
          />{" "}
        </span>
      </div>
      <hr className="text-gray-300 h-1 mt-2.5 " />
      <div className="flex mt-5 items-center gap-4">
        <h1 className="text-2xl text-black font-bold">Your Balance </h1>{" "}
        <span className="text-[20px] font-semibold">${balance}</span>
      </div>
      <h1 className="text-2xl mt-9  text-black font-bold">Users</h1>
      <LabeledInput
        type="string"
        placeholder="Search Users..."
        onchanges={GetUsers}
      />
      {users.map((user: User, index) => {
        return <UserBox key={index} index={index + 1} Name={user.firstname} to={user._id} />;
      })}
    </div>
  );
};
function LabeledInput(props: {
  type: string;
  placeholder: string;
  onchanges: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="flex mb-5 w-full mt-3.5  gap-2 flex-col">
      <input
        type={props.type}
        placeholder={props.placeholder}
        className="border text-[#8a9196] font-semibold w-full border-gray-300 p-2 rounded-md"
        onChange={props.onchanges}
      />
    </div>
  );
}
function UserBox(props: { index: number; Name: string; key: number,to:string}) {
  return (
    <div className="mb-5 flex flex-row justify-between" key={props.key}>
      <div className=" flex justify-center items-center gap-5">
        <div>
          <svg
            width="36"
            height="36"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="24" cy="24" r="24" fill="#d3d3d3" />
            <text
              x="24"
              y="28"
              textAnchor="middle"
              fontSize="24"
              fill="#333"
              fontFamily="Arial"
              dominantBaseline="middle"
            >
              U{props.index}
            </text>
          </svg>
        </div>
        <h3 className="text-[23px] font-semibold">{props.Name}</h3>
      </div>
      <Link to={"/transfer/" + props.to + "/" + props.Name}>
        <button className="bg-black cursor-pointer text-white px-3.5 py-2 font-semibold rounded-[6px]">
          Send Money
        </button>
      </Link>

    </div>
  );
}
export default Dashboard;
