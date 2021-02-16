import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../App";
import Axios from "axios";

const Home = () => {
  const [data, setData] = useState();
  const { state } = useContext(AuthContext);

  // Get token values from UseContext and Local Storage
  let accesstoken = state.accesstoken;
  let refreshtoken = JSON.parse(localStorage.getItem("refreshtoken"));

  // Declare custom axios calls for authorization and refreshing token
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

  // Define interceptor to handle error and refresh access token when appropriate
  authAxios.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      if (
        refreshtoken &&
        error.response.status === 403 //&&
      ) {
        const res = await refreshAxios.post("/refreshtoken");
        accesstoken = res.data.accesstoken;
        return await authAxios.post(
          "/test",
          {},
          {
            headers: {
              Authorization: `Bearer ${accesstoken}`,
            },
          }
        );
      }
      return Promise.reject(error.response);
    }
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    await authAxios
      .post("/test")
      .then((response) => {
        setData(response.data.post);
      })
      .catch((error) => {
        console.log(error.response);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      <p>{data}</p>
    </div>
  );
};

export default Home;
