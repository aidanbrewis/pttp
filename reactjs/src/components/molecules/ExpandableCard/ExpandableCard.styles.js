import theme from "../../../theme/theme";

const cardContainer = {
  marginTop: 20,
  marginBottom: 20,
  marginInlineEnd: 20,
  marginInlineStart: 20,
};

let styles = {
  lawWithAction: {
    display: "flex",
    alignItems: "center",
    marginTop: 10,
  },
  lawVersion: {
    flex: 5,
  },
  votingButtonsContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
  expiditeCard: {
    backgroundColor: "rgba(164, 3, 56, 1)",
    color: 'white',
  },
  notExpiditeCard: {
    backgroundColor: "rgb(248,203,214)",
  },
  collapsedContentContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: 'center',
    ...cardContainer,
  },
  title: {
    fontSize: "2rem",
    flex: 0.3,
    textAlign: "start",
  },
  expiditeDate: {
    fontSize: "1rem",
    flex: 1,
    textAlign: "center",
  },

  expandIcon: {
    fontSize: "1rem",
    flex: 0.2,
    textAlign: "end",
  },
  expandedContentContainer: {
    ...cardContainer,
  },
  commitButtons: {
    display: 'flex',
    justifyContent: 'space-evenly',
    marginBottom: 20
  }
};

export default styles;
