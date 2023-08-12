const unixToDate = (unixTime) => {
  let date = new Intl.DateTimeFormat("en-UK", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(unixTime);

  return date;
};

export default unixToDate;
