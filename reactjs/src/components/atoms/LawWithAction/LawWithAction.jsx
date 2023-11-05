import styles from "./LawWithAction.styles";
import { Button } from "@mui/material";
import settings from "../../../settings.json";
import languages from "../../../labels.json";

const LawWithAction = ({
  version,
  onOptionClick,
  voteResult,
  hasVotingButtons,
  hasUserVoteResults,
}) => {
  const labels = languages[settings.language];

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
            {labels.yes}
          </Button>
          <Button
            variant={voteResult === "no" ? "contained" : "text"}
            color={voteResult === "no" ? "no" : "inherit"}
            onClick={() => handleOptionClick("no")}
          >
            {labels.no}
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
            {labels.yes}
          </Button>
          <Button
            variant={voteResult === "no" ? "contained" : "text"}
            color={voteResult === "no" ? "no" : "inherit"}
          >
            {labels.no}
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
