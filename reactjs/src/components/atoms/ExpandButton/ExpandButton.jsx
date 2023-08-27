import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const ExpandButton = ({ expanded, onClick, style }) =>
  expanded ? (
    <div onClick={onClick} style={style}>
      <ExpandLessIcon />
    </div>
  ) : (
    <div onClick={onClick} style={style}>
      <ExpandMoreIcon />{" "}
    </div>
  );

export default ExpandButton;
