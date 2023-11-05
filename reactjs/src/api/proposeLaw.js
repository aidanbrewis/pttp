import awsExports from "../awsExports.json";

const proposeLaw = (
  username,
  jwtToken,
  proposedLawContent,
  proposedLawTitle,
  proposedLawCategory,
  expedite,
  expediteDate
) => {
  async function ApiCall() {
    const response = await fetch(awsExports.INVOKE_URL + "/pttp-vote", {
      method: "POST",
      body: JSON.stringify({
        operation: "proposeLaw",
        payload: {
          username: username,
          proposedLaw: proposedLawContent,
          proposedLawTitle: proposedLawTitle,
          proposedLawCategory: proposedLawCategory,
          expedite: expedite,
          expediteDate: expediteDate,
        },
      }),
      headers: { Authorization: jwtToken },
    });
    const result = await response.json();

    return result;
  }
  return ApiCall();
};

export default proposeLaw;
