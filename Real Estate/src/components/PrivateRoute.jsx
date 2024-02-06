import React from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";

const PrivateRoute = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  return currentUser ? <Outlet /> : navigate("/sign-in");
};

export default PrivateRoute;
