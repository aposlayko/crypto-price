const startBtn = document.getElementById("start-btn");
const stopBtn = document.getElementById("stop-btn");

startBtn.addEventListener('click', () => {
  console.log('start');
  axios
    .post("/trade-advisor/start")
    .then((response) => console.log(response))
    .catch((err) => console.log(err));
});

stopBtn.addEventListener('click', () => {
  console.log('stop');
  axios
    .post("/trade-advisor/stop")
    .then((response) => console.log(response))
    .catch((err) => console.log(err));
});