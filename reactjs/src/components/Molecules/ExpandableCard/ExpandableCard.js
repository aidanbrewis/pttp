import { Card } from "@mui/material";
import data from "../../../mockData/mockLawData";
import theme from "../../../theme/theme";
import unixToDate from "../../../unixToDate";
const ExpandableCard = () => {
  const firstLaw = data["2a67fafc-14eb-4b24-b77d-9cc070aeef08"];

  const date = unixToDate(firstLaw.expediteDate);

  return (
    <Card
      style={{
        backgroundColor: theme.palette.primary.main,
        width: "60%",
      }}
      onClick={() => {
        console.log("card clicked");
      }}
    >
      <div
        style={{
          margin: 20,
          display: "flex",
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: "2rem", flex: 1, textAlign: 'center' }}>{firstLaw.title}</div>
        <div style={{ fontSize: "1rem", flex: 2, textAlign: 'center'}}>
          {"voting ends on "}
          {date}
        </div>
        <div style={{ fontSize: "1rem", flex: 1,  textAlign: 'end'}}>expand</div>
      </div>
    </Card>
  );
};

export default ExpandableCard;
