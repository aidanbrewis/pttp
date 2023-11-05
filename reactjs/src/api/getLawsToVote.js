import awsExports from "../awsExports.json";

const getLawsToVote = (username, jwtToken) => {
  async function ApiCall() {
    const response = await fetch(awsExports.INVOKE_URL + "/pttp-get", {
      method: "POST",
      body: JSON.stringify({
        operation: "getLawsToVote",
        payload: {
          username: username,
        },
      }),
      headers: { Authorization: jwtToken },
    });
    const result = await response.json();

    return result;
  }
  return ApiCall();
};

export default getLawsToVote;
