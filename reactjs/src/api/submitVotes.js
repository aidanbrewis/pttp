const submitVotes = (votes) => {
  async function ApiCall() {

    const response = await fetch(
      "putUrlhere",
      {
        method: "POST",
        body: JSON.stringify({
          operation: "vote",
          payload: {
            username: "july",
            lawId: "b053299b-0a16-4d4b-8942-dcba23247bc9",
            votes: votes,
          },
        }),
        headers: {},
      }
    );
    const result = await response.json();
    console.log(result)
    return result;
  }
  return ApiCall();
};

export default submitVotes;
