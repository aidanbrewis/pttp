import React from "react";
import { Link } from "react-router-dom";
import styles from "./ProposeLawScreen.styles";
import ProposeLawCard from "../../components/molecules/ProposeLawCard/ProposeLawCard";

const ProposeLawScreen = () => {
  return (
    <>
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
        <div style={styles.proposalButton}>
          <Link to="/">back</Link>
        </div>
        <ProposeLawCard />
      </div>
      ;
    </>
  );
};

export default ProposeLawScreen;
