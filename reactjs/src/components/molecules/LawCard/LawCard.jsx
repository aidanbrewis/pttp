import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Checkbox,
  TextField,
  FormControlLabel,
  CircularProgress,
  Alert,
} from "@mui/material";
import Collapse from "@material-ui/core/Collapse";
import unixToDate from "../../../unixToDate";
import styles from "./LawCard.styles";
import { useNavigate, useLocation } from "react-router-dom";
import LawWithAction from "../../atoms/LawWithAction/LawWithAction";
import ExpandButton from "../../atoms/ExpandButton/ExpandButton";
import submitVotes from "../../../api/submitVotes";
import proposeLaw from "../../../api/proposeLaw";
import amendLaw from "../../../api/amendLaw";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

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
  hasUserVoteResults,
}) => {
  const hasTitle = !hasTitleField;

  const [expanded, setExpanded] = useState(lockExpanded);
  const [isAmend, setIsAmend] = useState(amend);
  const [voteResults, setVoteResults] = useState({});
  const [lawTitle, setLawTitle] = useState("");
  const [lawContent, setLawContent] = useState("");
  const [proposeLawLoading, setProposeLawLoading] = useState(false);
  const [sendVotesLoading, setSendVotesLoading] = useState(false);
  const [callAmendLawLoading, setCallAmendLawLoading] = useState(false);
  const [error, setError] = useState("");

  let navigate = useNavigate();

  const homeScreenNavigate = () => {
    let path = `/`;
    navigate(path);
  };

  const votedLawsNavigate = () => {
    let path = `/voted_laws`;
    navigate(path);
  };

  const LawScreenNavigate = () => {
    let path = `/` + lawId;
    navigate(path);
  };

  const LawScreenNavigateAmend = () => {
    let path = `/` + lawId + "/amend";
    navigate(path);
  };

  useEffect(() => {
    if (isAmend) {
      Object.keys(law.versions).map((key) =>
        setVoteResults((prevResults) => ({
          ...prevResults,
          [key]: "no",
        }))
      );
    } else if (hasUserVoteResults) {
      Object.keys(law.versions).map((key) =>
        setVoteResults((prevResults) => ({
          ...prevResults,
          [key]: law.versions[key].vote,
        }))
      );
    }
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
      LawScreenNavigateAmend();
      return;
    }
    if (!isAmend) {
      Object.keys(law.versions).map((key) =>
        setVoteResults((prevResults) => ({
          ...prevResults,
          [key]: "no",
        }))
      );
    } else {
      setVoteResults({});
    }
    setIsAmend(!isAmend);
  };

  const handleChange = (e) => {
    setError("");
    switch (e.target.id) {
      case "law-title":
        setLawTitle(e.target.value);
        break;
      case "law-content":
        setLawContent(e.target.value);
    }
  };

  const handleCloseError = () => {
    setError("");
  };

  const sendVotes = async () => {
    setSendVotesLoading(true);
    setError("");
    let result;
    let lambdaError;
    for (let i = 0; i < 10; i++) {
      try {
        result = await submitVotes(username, jwtToken, lawId, voteResults);
        break;
      } catch (e) {
        if (i === 9) {
          lambdaError = e.message;
        }
      }
    }
    if (lambdaError) {
      setSendVotesLoading(false);
      setError(lambdaError);
      return;
    }
    if (result.errorMessage) {
      setSendVotesLoading(false);
      setError(result.errorMessage);
      return;
    }
    if (hasLawPageButton) {
      window.location.reload();
    } else {
      homeScreenNavigate();
    }
  };

  const callAmendLaw = async () => {
    setCallAmendLawLoading(true);
    setError("");
    let result;
    let lambdaError;
    for (let i = 0; i < 10; i++) {
      try {
        result = await amendLaw(
          username,
          jwtToken,
          lawId,
          voteResults,
          lawContent
        );
        break;
      } catch (e) {
        if (i === 9) {
          lambdaError = e.message;
        }
      }
    }
    if (lambdaError) {
      setCallAmendLawLoading(false);
      setError(lambdaError);
      return;
    }
    if (result.errorMessage) {
      setCallAmendLawLoading(false);
      setError(result.errorMessage);
      return;
    }
    votedLawsNavigate();
  };

  const callProposeLaw = async () => {
    setProposeLawLoading(true);
    setError("");
    let result;
    let lambdaError;
    for (let i = 0; i < 10; i++) {
      try {
        result = await proposeLaw(
          username,
          jwtToken,
          lawContent,
          lawTitle,
          "",
          false,
          null
        );
        break;
      } catch (e) {
        if (i === 9) {
          lambdaError = e.message;
        }
      }
    }
    if (lambdaError) {
      setProposeLawLoading(false);
      setError(lambdaError);
      return;
    }
    if (result.errorMessage) {
      setProposeLawLoading(false);
      setError(result.errorMessage);
      return;
    }
    votedLawsNavigate();
  };

  const date = unixToDate(law?.expediteDate);

  const isExpedite = law?.expedite;

  return (
    <Card style={isExpedite ? styles.expediteCard : styles.notExpediteCard}>
      {error && (
        <Alert severity="error" onClose={handleCloseError}>
          {error}
        </Alert>
      )}
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
              hasUserVoteResults={hasUserVoteResults}
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
              <Button
                color={isAmend ? "primary" : "inherit"}
                variant={isAmend ? "contained" : "text"}
                onClick={handleAmend}
              >
                Amend
              </Button>

              {!isAmend && (
                <Button
                  color="inherit"
                  disabled={
                    sendVotesLoading || Object.keys(voteResults).length === 0
                  }
                  onClick={sendVotes}
                >
                  {sendVotesLoading && (
                    <CircularProgress size="1rem" color="primary" />
                  )}
                  Confirm Votes
                </Button>
              )}

              {isAmend && (
                <Button
                  color="inherit"
                  disabled={callAmendLawLoading || lawContent == ""}
                  onClick={callAmendLaw}
                >
                  {callAmendLawLoading && (
                    <CircularProgress size="1rem" color="primary" />
                  )}
                  Confirm Amendment
                </Button>
              )}
            </div>
          )}
          {hasProposeLawButton && (
            <div style={styles.commitButtons}>
              <FormControlLabel
                control={<Checkbox disabled></Checkbox>}
                label="Expedite Law"
              />
              <Button
                color="inherit"
                disabled={
                  proposeLawLoading || lawTitle == "" || lawContent == ""
                }
                onClick={callProposeLaw}
              >
                {proposeLawLoading && (
                  <CircularProgress size="1rem" color="primary" />
                )}
                Propose Law
              </Button>
            </div>
          )}
          {hasLawPageButton && (
            <div style={styles.openInNew}>
              <Button
                style={{
                  maxWidth: "30px",
                  maxHeight: "30px",
                  minWidth: "30px",
                  minHeight: "30px",
                }}
                color="inherit"
                onClick={LawScreenNavigate}
              >
                <OpenInNewIcon />
              </Button>
            </div>
          )}
        </div>
      </Collapse>
    </Card>
  );
};

export default LawCard;
