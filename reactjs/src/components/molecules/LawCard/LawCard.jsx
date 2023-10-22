import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Checkbox,
  TextField,
  FormControlLabel,
} from "@mui/material";
import Collapse from "@material-ui/core/Collapse";
import unixToDate from "../../../unixToDate";
import styles from "./LawCard.styles";
import { useNavigate, useLocation } from "react-router-dom";
import LawWithAction from "../../atoms/LawWithAction/LawWithAction";
import ExpandButton from "../../atoms/ExpandButton/ExpandButton";
import OpenInNewButton from "../../atoms/OpenInNewButton/OpenInNewButton";
import submitVotes from "../../../api/submitVotes";
import proposeLaw from "../../../api/proposeLaw";
import amendLaw from "../../../api/amendLaw";

const LawCard = ({
  law,
  lawId,
  username,
  jwtToken,
  hasTitleField,
  hasContentField,
  hasVotingButtons,
  hasProposeLawButton,
  lockExpanded,
  hasLawPageButton,
  amend,
}) => {
  const hasTitle = !hasTitleField;

  const [expanded, setExpanded] = useState(lockExpanded);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isAmend, setIsAmend] = useState(amend);
  const [voteResults, setVoteResults] = useState({});
  const [lawTitle, setLawTitle] = useState("");
  const [lawContent, setLawContent] = useState("");

  let navigate = useNavigate();

  const homeScreenNavigate = () => {
    let path = `/`;
    navigate(path);
  };

  const LawScreenNavigate = (amend) => {
    let path = `/` + lawId + amend ? "/amend" : "";
    navigate(path);
  };

  useEffect(() => {
    toggleDisabled();
  }, [voteResults]);

  const toggleExpanded = () => {
    if (!lockExpanded) {
      setExpanded(!expanded);
    }
  };

  const handleOptionClick = (versionId, option) => {
    if (isAmend && option === "yes") {
      setIsAmend(false);
    }
    setVoteResults((prevResults) => ({
      ...prevResults,
      [versionId]: option,
    }));
  };

  const handleAmend = () => {
    if (hasLawPageButton) {
      LawScreenNavigate(true);
    }
    if (!isAmend) {
      Object.keys(law.versions).map((key) => handleOptionClick(key, "No"));
    }
    setIsAmend(!isAmend);
  };

  const handleChange = (e) => {
    switch (e.target.id) {
      case "law-title":
        setLawTitle(e.target.value);
        break;
      case "law-content":
        setLawContent(e.target.value);
    }
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
    if (hasLawPageButton) {
      window.location.reload();
    } else {
      homeScreenNavigate();
    }
  };

  const amendLaw = async () => {
    const result = await amendLaw(username, jwtToken, lawId, lawContent);
    if (result.errorMessage) {
      throw Error(result.errorMessage);
    }
    if (hasLawPageButton) {
      window.location.reload();
    } else {
      homeScreenNavigate();
    }
  };

  const callProposeLaw = async () => {
    const result = await proposeLaw(
      username,
      jwtToken,
      lawContent,
      lawTitle,
      "",
      false,
      null
    );
    if (result.errorMessage) {
      throw Error(result.errorMessage);
    }
    homeScreenNavigate();
  };

  const date = unixToDate(law?.expediteDate);

  const isExpedite = law?.expedite;

  return (
    <Card style={isExpedite ? styles.expediteCard : styles.notExpediteCard}>
      <div style={styles.collapsedContentContainer} onClick={toggleExpanded}>
        {hasTitle && <div style={styles.title}>{law.title}</div>}
        {hasTitleField && (
          <TextField
            id="law-title"
            label="Title"
            value={lawTitle}
            onChange={handleChange}
            margin="normal"
            fullWidth
          />
        )}
        {isExpedite && (
          <div style={styles.expediteDate}>
            {"voting ends on "}
            {date}
          </div>
        )}
        {!lockExpanded && (
          <div>
            <ExpandButton expanded={expanded} style={styles.expandButton} />
          </div>
        )}
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

          {(hasContentField || isAmend) && (
            <TextField
              id="law-content"
              label="Law"
              value={lawContent}
              onChange={handleChange}
              margin="normal"
              multiline
              fullWidth
            />
          )}

          {hasVotingButtons && (
            <div style={styles.commitButtons}>
              <Button color="inherit" onClick={handleAmend}>
                Amend
              </Button>

              <Button
                color="inherit"
                disabled={isDisabled}
                onClick={isAmend ? amendLaw : sendVotes}
              >
                Confirm Votes
              </Button>
            </div>
          )}
          {hasProposeLawButton && (
            <div style={styles.commitButtons}>
              <FormControlLabel
                control={<Checkbox disabled></Checkbox>}
                label="Expedite Law"
              />
              <Button color="inherit" onClick={callProposeLaw}>
                Propose Law
              </Button>
            </div>
          )}
          {hasLawPageButton && (
            <OpenInNewButton
              onClick={LawScreenNavigate(false)}
              style={styles.openInNew}
            />
          )}
        </div>
      </Collapse>
    </Card>
  );
};

export default LawCard;
