import { awsExports } from "../aws-exports";

const getRejectedLaws = (jwtToken) => {
  async function ApiCall() {
    const response = await fetch(awsExports.INVOKE_URL, {
      method: "POST",
      body: JSON.stringify({
        operation: "getRejectedLaws",
        payload: {},
      }),
      headers: { Authorization: jwtToken },
    });
    const result = await response.json();

    return result;
  }
  return ApiCall();
};

export default getRejectedLaws;
