import ExpandableCard from "../../molecules/ExpandableCard/ExpandableCard";

const LawCards = (laws) => {
  return Object.keys(laws.laws).map((key) => (
    <div style={{ marginTop: 20}}>
      <ExpandableCard key={key} law={laws.laws[key]} />
    </div>
  ));
};

export default LawCards;
