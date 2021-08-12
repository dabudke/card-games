var exe = false;

window.onerror = (msg, url, line, col) => {
  if (!exe) {
    document.getElementById("errors").classList.toggle("errored");
    document.getElementById("errors").innerText = "An error occoured:\r\n";
    exe = true;
  }

  document.getElementById("errors").innerText += url + ":" + line + ":" + col + " - " + msg + "\r\n";
};
