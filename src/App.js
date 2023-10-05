import { BrowserRouter } from "react-router-dom"
import AppRouter from "./Routing/AppRouter"
import './styles/style.css'
import { useEffect, useState } from "react";

const App = () => {

  const [state, setState] = useState(null);

  const callBackendAPI = async () => {
    const response = await fetch('/make_file');
  };
  
  useEffect(() => {
    callBackendAPI()
  }, [])

  useEffect(() => {
    console.log(state);
  }, [state])


  return (
    <BrowserRouter>
      <AppRouter/>
    </BrowserRouter>
  )
}

export default App