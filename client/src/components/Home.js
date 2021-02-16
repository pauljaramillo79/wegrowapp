import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../App";
import Axios from "axios";

const Home = () => {
  const [data, setData] = useState();
  const { state, dispatch } = useContext(AuthContext);
  const logoutHandler = (e) => {
    dispatch({
      type: "LOGOUT",
    });
  };

  let accesstoken = state.accesstoken;
  let refreshtoken = JSON.parse(localStorage.getItem("refreshtoken"));
  const authAxios = Axios.create({
    headers: {
      Authorization: `Bearer ${accesstoken}`,
    },
  });
  const refreshAxios = Axios.create({
    headers: {
      Authorization: `Bearer ${refreshtoken}`,
    },
  });
  authAxios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (
        refreshtoken &&
        error.response.status === 403 //&&
      ) {
        return refreshAxios.post("/refreshtoken").then((res) => {
          accesstoken = res.data.accesstoken;
          return authAxios.post(
            "/test",
            {},
            {
              headers: {
                Authorization: `Bearer ${accesstoken}`,
              },
            }
          );
        });
      }
      return Promise.reject(error);
    }
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    await authAxios.post("/test").then((response) => {
      console.log(response.data);
      setData(response.data.post);
      // console.log(response.data);
    });
  }, []);
  return (
    <div>
      <h2>Welcome {state.user}</h2>
      <p>{data}</p>
      {state.isAuthenticated ? (
        <button onClick={logoutHandler}>Log Out</button>
      ) : (
        ""
      )}
    </div>
  );
};

export default Home;
