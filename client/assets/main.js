const oldAnalyticBtn = document.getElementById("old-analytic-btn");
const analyticBtn = document.getElementById("analytic-btn");

oldAnalyticBtn.addEventListener("click", () => {
  axios
    .post("/update-analytics/update-old")
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
});

analyticBtn.addEventListener("click", () => {
  axios
    .post("/update-analytics/update")
    .then((response) => {
      console.log(response);
    })
    .catch((err) => {
      console.log(err);
    });
});
