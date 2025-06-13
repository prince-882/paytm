import { BrowserRouter, Route, Routes } from "react-router"
import Signup from "./Components/Signup"
import Signin from "./Components/Signin"
import Sendmoney from "./Components/Sendmoney"
import Dashboard from "./Components/Dashboard"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup/>} />
        <Route path="/signin" element={<Signin/>} />
        <Route path="/transfer/:to/:name" element={<Sendmoney/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
