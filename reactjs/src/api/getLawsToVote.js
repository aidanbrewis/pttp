import { awsExports } from "../aws-exports";

const getLawsToVote = () => {
  async function ApiCall() {
    const response = await fetch(awsExports.INVOKE_URL, {
      method: "POST",
      body: JSON.stringify({
        operation: "getLawsToVote",
        payload: {
          username: "july",
        },
      }),
      headers: {},
    });
    const result = await response.json();

    return result;
  }
  return ApiCall();
};

export default getLawsToVote;
