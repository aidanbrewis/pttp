import LawCard from "../../molecules/LawCard/LawCard";

const LawCards = (data) => {
  return Object.keys(data.laws).map((key) => (
    <div style={{ marginTop: 20 }}>
      <LawCard
        law={data.laws[key]}
        lawId={key}
        username={data.username}
        jwtToken={data.jwtToken}
        hasTitleField={data.hasTitleField}
        hasContentField={data.hasContentField}
        hasVotingButtons={data.hasVotingButtons}
        hasProposeLawButton={data.hasProposeLawButton}
        lockExpanded={data.lockExpanded}
        hasLawPageButton={data.hasLawPageButton}
        amend={data.amend}
        hasUserVoteResults={data.hasUserVoteResults}
      />
    </div>
  ));
};

export default LawCards;
