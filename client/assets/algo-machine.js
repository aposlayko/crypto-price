

const downloadHystoricalDataBtn = document.getElementById("download-hystorycal-data");
const dateStartInput = document.getElementById("date-start");
const dateEndInput = document.getElementById("date-end");
const tikerInput = document.getElementById("tiker-input");
const intervalInput = document.getElementById("interval-input");

const fileNameSelect = document.getElementById("files-list-select");
const delayInput = document.getElementById("delay-input");
const startAlgoMachineBtn = document.getElementById("start-algo-machine");


downloadHystoricalDataBtn.addEventListener("click", () => {
  const tiker = tikerInput.value;
  const interval = intervalInput.value;
  const dateStart = dateStartInput.value;
  const dateEnd = dateEndInput.value;
  
  axios
    .post("/algo-machine/download-hystorical-data", {tiker, interval, dateStart,  dateEnd})
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
