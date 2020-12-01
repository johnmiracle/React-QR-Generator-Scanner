window.onload = function () {
  navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMdeia ||
    navigator.msGetUserMedia;
};
