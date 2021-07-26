console.log("refresh token");
const codeEl = document.getElementById("code");

const url = new URL(window.location.href);
const code = url.searchParams.get("code");

axios.post("/update-analytics/refresh_token", { code })
    .then((response) => {
        codeEl.innerHTML = code;
    });
