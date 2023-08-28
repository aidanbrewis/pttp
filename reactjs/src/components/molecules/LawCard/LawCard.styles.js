const cardContainer = {
  marginTop: 35,
  marginBottom: 35,
  marginInlineEnd: 35,
  marginInlineStart: 35,
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
    ...cardContainer,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: "1.8rem",
    flex: 1.6,
    textAlign: "justify",
  },
  expiditeDate: {
    fontStyle: "italic",
    fontSize: "1.4rem",
    fontWeight: 350,
    flex: 1,
    textAlign: "center",
  },
  icons: { display: "flex" },
  expandButton: {
    fontSize: "1rem",
    flex: 0.2,
    textAlign: "end",
  },
  expandedContentContainer: {
    ...cardContainer,
    marginTop: 0,
  },
  commitButtons: {
    display: "flex",
    justifyContent: "space-evenly",
    marginTop: 35,
  },
  openInNew: {
    fontSize: "1rem",
    flex: 0.1,
    textAlign: "end",
  },
};

export default styles;
