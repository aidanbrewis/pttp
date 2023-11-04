import styles from "./LawWithAction.styles";
import { Button } from "@mui/material";

const LawWithAction = ({
  version,
  onOptionClick,
  voteResult,
  hasVotingButtons,
  hasUserVoteResults,
}) => {
  const handleOptionClick = (option) => {
    onOptionClick(option);
  };

  if (hasVotingButtons) {
    return (
      <div>
        <div style={styles.lawVersion}>{version.content}</div>
        <div style={styles.votingButtonsContainer}>
          <Button
            variant={voteResult === "yes" ? "contained" : "text"}
            color={voteResult === "yes" ? "yes" : "inherit"}
            onClick={() => handleOptionClick("yes")}
            style={{ marginRight: 5 }}
          >
            Yes
          </Button>
          <Button
            variant={voteResult === "no" ? "contained" : "text"}
            color={voteResult === "no" ? "no" : "inherit"}
            onClick={() => handleOptionClick("no")}
          >
            No
          </Button>
        </div>
      </div>
    );
  } else if (hasUserVoteResults) {
    return (
      <div>
        <div style={styles.lawVersion}>{version.content}</div>
        <div style={styles.votingButtonsContainer}>
          <Button
            variant={voteResult === "yes" ? "contained" : "text"}
            color={voteResult === "yes" ? "yes" : "inherit"}
            style={{ marginRight: 5 }}
          >
            Yes
          </Button>
          <Button
            variant={voteResult === "no" ? "contained" : "text"}
            color={voteResult === "no" ? "no" : "inherit"}
          >
            No
          </Button>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <div style={styles.lawVersion}>{version.content}</div>
        <div style={styles.votingButtonsContainer}>
          <Button
            variant={"contained"}
            color={"yes"}
            style={{ marginRight: 5 }}
          >
            {version.yes}
          </Button>
          <Button variant={"contained"} color={"no"}>
            {version.no}
          </Button>
        </div>
      </div>
    );
  }
};
export default LawWithAction;
