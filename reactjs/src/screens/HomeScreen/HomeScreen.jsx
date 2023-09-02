import React, { useEffect, useState } from "react";
import getLawsToVote from "../../api/getLawsToVote";
import LawCards from "../../components/organisms/LawCards/LawCards";

const HomeScreen = () => {
  const [laws, setLaws] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    let data = await getLawsToVote();
    setLaws(data);
  };

  return (
    <div
      style={{
        margin: 'auto',
        padding: 150,
        backgroundColor: "rgb(92,92,92)",
        justifyContent: "center",
        alignSelf: 'center',
        overflow: "hidden",
        maxWidth: '60%'
      }}
    >
        <LawCards laws={laws} />
    </div>
  );
};

export default HomeScreen;
