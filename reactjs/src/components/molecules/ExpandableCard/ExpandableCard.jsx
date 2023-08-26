import { useState } from "react";
import { Button, Card } from "@mui/material";
import Collapse from "@material-ui/core/Collapse";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import unixToDate from "../../../unixToDate";
import styles from "./ExpandableCard.styles";

export const LawWithAction = (version, onOptionClick, voteResult) => {
  const handleOptionClick = (option) => {
    onOptionClick(option);
  };

  return (
    <div style={styles.lawWithAction}>
      <div style={styles.lawVersion}>{version.version.content}</div>
      <div style={styles.votingButtonsContainer}>
        <Button
          variant={voteResult === "yes" ? "contained" : "text"}
          color={voteResult === "yes" ? "success" : "inherit"}
          onClick={() => handleOptionClick("yes")}
        >
          Yes
        </Button>
        <Button
          variant={voteResult === "no" ? "contained" : "text"}
          color={voteResult === "no" ? "error" : "inherit"}
          onClick={() => handleOptionClick("no")}
        >
          No
        </Button>
      </div>
    </div>
  );
};

const ExpandIcon = ({ expanded }) =>
  expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />;

const ExpandableCard = (law) => {
  const [expanded, setExpanded] = useState(false);

  const [voteResults, setVoteResults] = useState({});

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const handleOptionClick = (versionId, option) => {
    setVoteResults((prevResults) => ({
      ...prevResults,
      [versionId]: option,
    }));
  };
  console.log(law);

  const date = unixToDate(law.law.expediteDate);

  const isExpedite = law.law.expedite;

  return (
    <Card style={isExpedite ? styles.expiditeCard : styles.notExpiditeCard}>
      <div style={styles.collapsedContentContainer} onClick={toggleExpanded}>
        <div style={styles.title}>{law.law.title}</div>
        {isExpedite && (
          <div style={styles.expiditeDate}>
            {"voting ends on "}
            {date}
          </div>
        )}

        <div style={styles.expandIcon} onClick={toggleExpanded}>
          <ExpandIcon expanded={expanded} />
        </div>
      </div>
      <Collapse in={expanded}>
        <div style={styles.expandedContentContainer}>
          {Object.keys(law.law.versions).map((key) => (
            <LawWithAction
              key={key}
              onOptionClick={(option) => handleOptionClick(key, option)}
              version={law.law.versions[key]}
              voteResult={voteResults[key] || null}
            />
          ))}
        </div>
        <div style={styles.commitButtons}>
          <Button color="inherit">Amend</Button>
          <Button color="inherit">Confirm Votes</Button>
        </div>
      </Collapse>
    </Card>
  );
};

export default ExpandableCard;
