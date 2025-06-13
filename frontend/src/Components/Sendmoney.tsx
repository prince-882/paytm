import axios from "axios";
import { useRef, useState } from "react";
import {  useNavigate, useParams } from "react-router";

const Sendmoney = () => {
  const params = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("jwt");
  if(!token) return <div>You Dont Have An Account</div>
  const Amountref = useRef(
    null
  ) as unknown as React.RefObject<HTMLInputElement>;
  const [message, setMessage] = useState("");
  async function Transfer() {
    try {
      if (!((Amountref.current.value as unknown as number) > 0)) {
        return setMessage("Please Enter A valid Amount");
      }
      const res = await axios.post(
        "https://paytm-back.vercel.app/api/v1/account/transfer/",
        {
          to: params.to,
          amount: Amountref.current.value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res);
      navigate("/dashboard")
    }
     catch (error) {
      setMessage("Insufficent Balance or Unauthorized")
    }
  }
  return (
    <div className="h-screen w-screen flex  items-center justify-center bg-[#808080] py-16">
      <div className="bg-white px-8 rounded-[4px]">
        <h1 className="text-3xl font-bold mx-24 mt-8 mb-12 text-center">
          Send Money
        </h1>
        <div className="flex items-center">
          <svg
            width="50"
            height="50"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="24" cy="24" r="24" fill="#21c460" />
            <text
              x="24"
              y="28"
              textAnchor="middle"
              fontSize="24"
              fill="#ffffff"
              fontFamily="Arial"
              dominantBaseline="middle"
            >
              {Array.from(params.name as string)[0].toUpperCase()}
            </text>
          </svg>
          <h1 className="text-2xl ml-4 text-black font-semibold">
            {params.name}
          </h1>
        </div>
        <LabeledInput
          type={"number"}
          placeholder={"Enter Amount"}
          label={"Amount(in Rs)"}
          ref={Amountref}
        />
        <button
          onClick={Transfer}
          className="bg-[#21c460] text-white mb-7 py-3 rounded-lg font-semibold px-36"
        >
          Initiate Transfer{" "}
        </button>
        <div>{message}</div>
      </div>
    </div>
  );
}

function LabeledInput(props: {
  type: string;
  placeholder: string;
  ref: React.RefObject<HTMLInputElement>;
  label: string;
}) {
  return (
    <div className="flex mb-5 w-full mt-3.5  gap-2 flex-col">
      <label className="font-semibold">{props.label}</label>
      <input
        type={props.type}
        placeholder={props.placeholder}
        className="border text-[#8a9196] font-semibold w-full border-gray-300 p-2 rounded-md"
        ref={props.ref}
      />
    </div>
  );
}
export default Sendmoney;
