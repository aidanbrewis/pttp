import React, { useEffect, useState } from "react";
import { Auth } from "aws-amplify";
import getLawsToVote from "../../api/getLawsToVote";
import LawCards from "../../components/organisms/LawCards/LawCards";

const Home = () => {
  const [laws, setLaws] = useState([]);
  const [jwtToken, setJwtToken] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const session = await Auth.currentSession();
      const jwtToken = session.getIdToken().getJwtToken();
      setJwtToken(jwtToken);
      const userInfo = await Auth.currentUserInfo();
      const username = userInfo.attributes.email;
      setUsername(username);
      let data = await getLawsToVote(username, jwtToken);
      data.username = username;
      data.jwtToken = jwtToken;
      setLaws(data);
    } catch (error) {
      console.log("Error fetching JWT token:", error);
    }
  };

  return (
    <div
      style={{
        margin: "auto",
        padding: 150,
        backgroundColor: "rgb(92,92,92)",
        justifyContent: "center",
        alignSelf: "center",
        overflow: "hidden",
        maxWidth: "60%",
      }}
    >
      <LawCards laws={laws} />
    </div>
  );
};

export default Home;
