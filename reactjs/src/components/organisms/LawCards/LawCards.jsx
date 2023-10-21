import LawCard from "../../molecules/LawCard/LawCard";

const LawCards = (data) => {
  return Object.keys(data.laws).map((key) => (
    <div style={{ marginTop: 20 }}>
      <LawCard
        key={key}
        law={data.laws[key]}
        lawId={key}
        username={data.username}
        jwtToken={data.jwtToken}
        hasVotingButtons={data.hasVotingButtons}
      />
    </div>
  ));
};

export default LawCards;
