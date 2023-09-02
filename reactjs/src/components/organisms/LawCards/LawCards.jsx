import LawCard from "../../molecules/LawCard/LawCard";

const LawCards = (laws) => {
  return Object.keys(laws.laws).map((key) => (
    <div style={{ marginTop: 20 }}>
      <LawCard key={key} law={laws.laws[key]} lawId={key}/>
    </div>
  ));
};

export default LawCards;
