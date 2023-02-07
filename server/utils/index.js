const addToAverage = (oldAvg, oldCount, newValue) => {
  return (oldAvg * oldCount + newValue) / (oldCount + 1);
};
const replaceInAverage = (oldAvg, oldCount, oldValue, newValue) => {
  return (oldAvg * oldCount - oldValue + newValue) / oldCount;
};

module.exports = {
  addToAverage,
  replaceInAverage,
};
