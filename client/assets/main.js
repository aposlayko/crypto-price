const mainBtn = document.getElementById('main-btn');

mainBtn.addEventListener('click', () => {
    axios.post('/update-analytics/')
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
});
