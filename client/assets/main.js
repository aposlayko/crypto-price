const oldAnalyticBtn = document.getElementById("old-analytic-btn");
const analyticBtn = document.getElementById("analytic-btn");

const downloadHystoricalDataBtn = document.getElementById("download-hystorycal-data");
const tikerInput = document.getElementById("tiker-input");
const intervalInput = document.getElementById("interval-input");

oldAnalyticBtn.addEventListener("click", () => {
  axios
    .post("/update-analytics/update-old")
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
});

analyticBtn.addEventListener("click", () => {
  axios
    .post("/update-analytics/update")
    .then((response) => {
      console.log(response.data);
    })
    .catch((err) => {
      console.log(err);
    });
});

downloadHystoricalDataBtn.addEventListener("click", () => {
  const tiker = tikerInput.value;
  const interval = intervalInput.value

  axios
    .post("/update-analytics/download-hystorical-data", {tiker, interval})
    .then((response) => {
      console.log(response.data);
    })
    .catch((err) => {
      console.log(err);
    });
});
