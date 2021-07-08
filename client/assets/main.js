const oldAnalyticBtn = document.getElementById("old-analytic-btn");
const analyticBtn = document.getElementById("analytic-btn");
const downloadHystoricalDataBtn = document.getElementById("download-hystorycal-data");

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
  axios
    .post("/update-analytics/download-hystorical-data")
    .then((response) => {
      console.log(response.data);
    })
    .catch((err) => {
      console.log(err);
    });
});
