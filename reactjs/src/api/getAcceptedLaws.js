import { awsExports } from "../aws-exports";

const getAcceptedLaws = (jwtToken) => {
  async function ApiCall() {
    const response = await fetch(awsExports.INVOKE_URL, {
      method: "POST",
      body: JSON.stringify({
        operation: "getAcceptedLaws",
        payload: {},
      }),
      headers: { Authorization: jwtToken },
    });
    const result = await response.json();

    return result;
  }
  return ApiCall();
};

export default getAcceptedLaws;