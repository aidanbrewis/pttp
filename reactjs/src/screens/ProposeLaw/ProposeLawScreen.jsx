import React from "react";
import { Button } from "@material-ui/core";
import styles from "./ProposeLawScreen.styles";
import ProposeLawCard from "../../components/molecules/ProposeLawCard/ProposeLawCard";
import { useNavigate } from "react-router-dom";

const ProposeLawScreen = () => {
  let navigate = useNavigate();

  const routeChange = () => {
    let path = `/`;
    navigate(path);
  };

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
          <Button color="inherit" variant="contained" onClick={routeChange}>
            back
          </Button>
        </div>
        <ProposeLawCard />
      </div>
      ;
    </>
  );
};

export default ProposeLawScreen;
