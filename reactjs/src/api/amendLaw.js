import { awsExports } from "../aws-exports";

const amendLaw = (username, jwtToken, lawId, amendedLaw) => {
  async function ApiCall() {
    const response = await fetch(awsExports.INVOKE_URL, {
      method: "POST",
      body: JSON.stringify({
        operation: "vote",
        payload: {
          username: username,
          lawId: lawId,
          votes: {},
          amend: true,
          amendedLaw: amendedLaw,
        },
      }),
      headers: { Authorization: jwtToken },
    });
    const result = await response.json();

    return result;
  }
  return ApiCall();
};

export default amendLaw;
