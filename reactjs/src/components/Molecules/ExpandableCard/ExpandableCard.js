import { useState } from "react";
import { Button, Card } from "@mui/material";
import Collapse from "@material-ui/core/Collapse";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import data from "../../../mockData/mockLawData";
import theme from "../../../theme/theme";
import unixToDate from "../../../unixToDate";

const LawWithAction = (law) => {
  <div
    style={{
      marginTop: 20,
      marginBottom: 20,
      marginInlineEnd: 20,
      marginInlineStart: 20,
    }}
  >
    <div style={{ flex: 5 }}>{law}</div>
    <div style={{ flex: 1 }}>
      <Button>yes</Button>
    </div>
    <div style={{ flex: 1 }}>
      <Button>no</Button>
    </div>
  </div>;
};

const ExpandIcon = ({ expanded }) =>
  expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />;

const ExpandableCard = () => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const firstLaw = data["2a67fafc-14eb-4b24-b77d-9cc070aeef08"];
  const date = unixToDate(firstLaw.expediteDate);
  console.log(date);
  const expedite = firstLaw.expedite;

  return (
    <Card
      style={
        expedite
          ? {
              backgroundColor: "rgba(255, 205, 107, 1)",
              maxWidth: "60%",
            }
          : {
              backgroundColor: theme.palette.primary.main,
              maxWidth: "60%",
            }
      }
    >
      <div
        style={{
          marginTop: 20,
          marginBottom: 20,
          marginInlineEnd: 20,
          marginInlineStart: 20,
          display: "flex",
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: "2rem", flex: 0.3, textAlign: "start" }}>
          {firstLaw.title}
        </div>
        <div style={{ fontSize: "1rem", flex: 1, textAlign: "center" }}>
          {"voting ends on "}
          {date}
        </div>
        <div
          style={{ fontSize: "1rem", flex: 0.2, textAlign: "end" }}
          onClick={toggleExpanded}
        >
          <ExpandIcon expanded={expanded} onClick={toggleExpanded} />
        </div>
      </div>
      <Collapse in={expanded}>
        <div
          style={{
            marginTop: 20,
            marginBottom: 20,
            marginInlineEnd: 20,
            marginInlineStart: 20,
            display: "flex",
            alignItems: "center",
          }}
        >
          <div style={{ flex: 1 }}>{firstLaw.versions[1].content}</div>
          <Button
            variant="outlined"
            color="success"
            style={{ marginRight: 10}}
          >
            yes
          </Button>
          <Button variant="outlined" color={"error"}>
            no
          </Button>
        </div>
        ;
      </Collapse>
    </Card>
  );
};

export default ExpandableCard;
