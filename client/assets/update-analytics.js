const analyticBtn = document.getElementById("analytic-btn");
const analyticBtnV2 = document.getElementById("analytic-btn-v2");
const analyticStatus = document.getElementById("analytic-status");

analyticBtn.addEventListener("click", () => {
  analyticStatus.innerHTML = '';
  axios
    .post("/update-analytics/update")
    .then((response) => {
      if (response.data.authUrl) {
        analyticStatus.innerHTML = 'Try againg';
        window.open(response.data.authUrl);
      } else if (response.data.isUpdated) {
        analyticStatus.innerHTML = '<a target="_blank" href="https://docs.google.com/spreadsheets/d/17D4eYUyrYZepfIx85B2_R6ccU9GocaVyEBsCyKoHUJ8/edit#gid=1566192616">Go to Analytics</a>'
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

analyticBtnV2.addEventListener("click", () => {
  analyticStatus.innerHTML = '';
  axios
      .post("/update-analytics/update-v2")
      .then((response) => {
        if (response.data.authUrl) {
          analyticStatus.innerHTML = 'Try againg';
          window.open(response.data.authUrl);
        } else if (response.data.isUpdated) {
          analyticStatus.innerHTML = '<a target="_blank" href="https://docs.google.com/spreadsheets/d/17D4eYUyrYZepfIx85B2_R6ccU9GocaVyEBsCyKoHUJ8/edit#gid=1566192616">Go to Analytics</a>'
        }
      })
      .catch((err) => {
        console.log(err);
      });
});
