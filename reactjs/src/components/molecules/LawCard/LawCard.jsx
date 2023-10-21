import { useEffect, useState } from "react";
import { Button, Card } from "@mui/material";
import Collapse from "@material-ui/core/Collapse";
import unixToDate from "../../../unixToDate";
import styles from "./LawCard.styles";
import LawWithAction from "../../atoms/LawWithAction/LawWithAction";
import ExpandButton from "../../atoms/ExpandButton/ExpandButton";
import OpenInNewButton from "../../atoms/OpenInNewButton/OpenInNewButton";
import submitVotes from "../../../api/submitVotes";

const LawCard = ({ law, lawId, username, jwtToken, hasVotingButtons }) => {
  const [expanded, setExpanded] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [voteResults, setVoteResults] = useState({});

  useEffect(() => {
    toggleDisabled();
  }, [voteResults]);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const handleOptionClick = (versionId, option) => {
    setVoteResults((prevResults) => ({
      ...prevResults,
      [versionId]: option,
    }));
  };

  const toggleDisabled = () => {
    Object.keys(voteResults).length == Object.keys(law.versions).length &&
      setIsDisabled(false);
  };

  const sendVotes = async () => {
    const result = await submitVotes(username, jwtToken, lawId, voteResults);
    if (result.errorMessage) {
      throw Error(result.errorMessage);
    }
    window.location.reload();
  };

  const date = unixToDate(law.expediteDate);

  const isExpedite = law.expedite;

  return (
    <Card style={isExpedite ? styles.expiditeCard : styles.notExpiditeCard}>
      <div style={styles.collapsedContentContainer} onClick={toggleExpanded}>
        <div style={styles.title}>{law.title}</div>
        {isExpedite && (
          <div style={styles.expiditeDate}>
            {"voting ends on "}
            {date}
          </div>
        )}
        <div>
          <ExpandButton expanded={expanded} style={styles.expandButton} />
        </div>
      </div>
      <Collapse in={expanded}>
        <div style={styles.expandedContentContainer}>
          {Object.keys(law.versions).map((key) => (
            <LawWithAction
              key={key}
              onOptionClick={(option) => handleOptionClick(key, option)}
              version={law.versions[key]}
              voteResult={voteResults[key] || null}
              hasVotingButtons={hasVotingButtons}
            />
          ))}

          {hasVotingButtons && (
            <div style={styles.commitButtons}>
              <Button
                color="inherit"
                onClick={() => console.log("need a screen to navigate to...")}
              >
                Amend
              </Button>

              <Button color="inherit" disabled={isDisabled} onClick={sendVotes}>
                Confirm Votes
              </Button>
            </div>
          )}
          <OpenInNewButton
            onClick={() => console.log("need a screen to navigate to...")}
            style={styles.openInNew}
          />
        </div>
      </Collapse>
    </Card>
  );
};

export default LawCard;
