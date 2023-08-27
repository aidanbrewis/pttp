import { useState } from "react";
import { Button, Card } from "@mui/material";
import Collapse from "@material-ui/core/Collapse";
import unixToDate from "../../../unixToDate";
import styles from "./LawCard.styles";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import LawWithAction from "../LawWithAction/LawWithAction";
import ExpandButton from "../ExpandButton/ExpandButton";


const OpenInNewButton = ({ onClick, style }) => {
  return (
    <div onClick={onClick} style={styles}>
      <OpenInNewIcon />
    </div>
  );
};

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

  const date = unixToDate(law.law.expediteDate);

  const isExpedite = law.law.expedite;

  return (
    <Card style={isExpedite ? styles.expiditeCard : styles.notExpiditeCard}>
      <div style={styles.collapsedContentContainer}>
        <div style={styles.title}>{law.law.title}</div>
        {isExpedite && (
          <div style={styles.expiditeDate}>
            {"voting ends on "}
            {date}
          </div>
        )}
        <div style={styles.icons}>
          <OpenInNewButton
            onClick={console.log("need a screen to navigate to...")}
            style={styles.openInNew}
          />
          <div>
            <ExpandButton
              expanded={expanded}
              onClick={toggleExpanded}
              style={styles.expandButton}
            />
          </div>
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
