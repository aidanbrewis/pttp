import { awsExports } from "../aws-exports";

const submitVotes = (username, jwtToken, lawId, votes) => {
  async function ApiCall() {
    const response = await fetch(awsExports.INVOKE_URL, {
      method: "POST",
      body: JSON.stringify({
        operation: "vote",
        payload: {
          username: username,
          lawId: lawId,
          votes: votes,
        },
      }),
      headers: { Authorization: jwtToken },
    });
    const result = await response.json();

    return result;
  }
  return ApiCall();
};

export default submitVotes;
