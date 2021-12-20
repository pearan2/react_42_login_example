import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import axios from "axios";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/return" element={<FirtyTwoLoginRedirectionPage />} />
      </Routes>
    </BrowserRouter>
  );
};

const Main = () => {
  const buttonClick = () => {
    window.location.href = "";
  };

  return <button onClick={buttonClick}> 42Login </button>;
};

const FirtyTwoLoginRedirectionPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [nickname, setNickname] = useState("");

  const location = useLocation();

  const getToken = async (): Promise<string> => {
    const code = location.search
      .substring(1, location.search.length)
      .split("=")[1];
    return axios
      .post("https://api.intra.42.fr/oauth/token", {
        grant_type: "authorization_code",
        client_id: "",
        client_secret: "",
        code: code,
        redirect_uri: ""
      })
      .then(res => {
        if (res.status !== 200) {
          throw Error();
        } else {
          return res.data.access_token;
        }
      })
      .catch(res => {
        throw Error();
      });
  };

  const getNickname = async (): Promise<string> => {
    const token = await getToken();
    return axios
      .get("https://api.intra.42.fr/v2/me", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        if (res.status !== 200) {
          throw Error();
        } else {
          return res.data.first_name + res.data.last_name;
        }
      })
      .catch(res => {
        throw Error();
      });
  };

  const callback = async () => {
    const nicknameFromAPI = await getNickname();
    setIsLoading(false);
    setNickname(nicknameFromAPI);
  };

  useEffect(() => {
    callback();
  }, []);
  return isLoading ? <div>Loading...</div> : <div>{nickname}</div>;
};

ReactDOM.render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
