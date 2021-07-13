const analyticBtn = document.getElementById("analytic-btn");

const downloadHystoricalDataBtn = document.getElementById("download-hystorycal-data");
const tikerInput = document.getElementById("tiker-input");
const intervalInput = document.getElementById("interval-input");

const fileNameSelect = document.getElementById("files-list-select");
const delayInput = document.getElementById("delay-input");
const startAlgoMachineBtn = document.getElementById("start-algo-machine");

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
