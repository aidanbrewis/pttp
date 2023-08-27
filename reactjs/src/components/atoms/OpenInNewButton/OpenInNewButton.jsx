import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const OpenInNewButton = ({ onClick, style }) => {
  return (
    <div onClick={onClick} style={style}>
      <OpenInNewIcon />
    </div>
  );
};

export default OpenInNewButton;
