import { useEffect, useState } from "react"
import Home from "./components/restaurant/Home";
import { useDispatch } from "react-redux";
import { setCustomerRestaurantId, setIsAdmin } from "./redux/authSlice";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import HomeConsumer from "./components/consumer/HomeConsumer";
import HomeAdmin from "./components/admin/HomeAdmin";

function App() {
  const dispatch = useDispatch();

  const params = new URLSearchParams(window.location.search);

  useEffect(() => {
    if (window.location.pathname == "/admin") {
      dispatch(setIsAdmin(true));
    } else if (params.get("restaurantId")) {
      dispatch(setCustomerRestaurantId(params.get("restaurantId")));
    }
  }, []);

  return (
    <div data-theme="light">
      {window.location.pathname == "/admin" ?
        <HomeAdmin /> :
        params.get("restaurantId") != null ?
          <HomeConsumer /> :
          <Home />
      }
      <ToastContainer position={toast.POSITION.BOTTOM_CENTER} />
    </div>
  );
}

export default App
