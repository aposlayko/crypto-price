const analyticBtn = document.getElementById("analytic-btn");
const analyticStatus = document.getElementById("analytic-status");

const downloadHystoricalDataBtn = document.getElementById("download-hystorycal-data");
const tikerInput = document.getElementById("tiker-input");
const intervalInput = document.getElementById("interval-input");

const fileNameSelect = document.getElementById("files-list-select");
const delayInput = document.getElementById("delay-input");
const startAlgoMachineBtn = document.getElementById("start-algo-machine");

const updateAnalyticStatus = false;

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

downloadHystoricalDataBtn.addEventListener("click", () => {
  const tiker = tikerInput.value;
  const interval = intervalInput.value

  axios
    .post("/algo-machine/download-hystorical-data", {tiker, interval})
    .then((response) => console.log(response.data))
    .catch((err) => console.log(err));
});

startAlgoMachineBtn.addEventListener("click", () => {
  const fileName = fileNameSelect.value;
  const delay = delayInput.value;

  axios
    .post("/algo-machine/start", {fileName, delay})
    .then((response) => console.log(response.data))
    .catch((err) => console.log(err));
});
