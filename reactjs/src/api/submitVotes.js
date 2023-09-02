import { awsExports } from "../aws-exports";

const submitVotes = (lawId, votes) => {
  async function ApiCall() {
    const response = await fetch(awsExports.INVOKE_URL, {
      method: "POST",
      body: JSON.stringify({
        operation: "vote",
        payload: {
          username: "july",
          lawId: lawId,
          votes: votes,
        },
      }),
      headers: {},
    });
    const result = await response.json();

    return result;
  }
  return ApiCall();
};

export default submitVotes;
