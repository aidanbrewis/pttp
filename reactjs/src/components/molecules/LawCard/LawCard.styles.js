const cardContainer = {
  marginTop: 20,
  marginBottom: 20,
  marginInlineEnd: 20,
  marginInlineStart: 20,
};

let styles = {
  expiditeCard: {
    backgroundColor: "rgba(164, 3, 56, 1)",
    color: "white",
    borderRadius: 10,
  },
  notExpiditeCard: {
    backgroundColor: "rgb(248,203,214)",
    borderRadius: 10,
  },
  collapsedContentContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    ...cardContainer,
  },
  title: {
    fontSize: "2rem",
    flex: 1.5,
    textAlign: "start",
  },
  expiditeDate: {
    fontSize: "1rem",
    flex: 1,
    textAlign: "center",
  },
  icons: { display: "flex" },
  expandButton: {
    fontSize: "1rem",
    flex: 0.2,
    textAlign: "end",
  },
  openInNew: {
    fontSize: "1rem",
    flex: 0.1,
    textAlign: "end",
  },
  expandedContentContainer: {
    ...cardContainer,
  },
  commitButtons: {
    display: "flex",
    justifyContent: "space-evenly",
  },
};

export default styles;
