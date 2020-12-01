import React, { useState } from "react";
import { Fab, TextareaAutosize } from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import { Link } from "react-router-dom";
import QrScan from "react-qr-reader";

function QRscanner() {
  const [qrscan, setQrscan] = useState("No result");
  const handleScan = (data) => {
    if (data) {
      setQrscan(data);
    }
  };
  const handleError = (err) => {
    console.error(err);
  };

  // if (navigator.getUserMedia) {
  //   navigator.mediaDevices.getUserMedia(
  //     {
  //       video: true,
  //     },
  //     function (localMediaStream) {},
  //     function (err) {
  //       alert(
  //         "The following error occurred when trying to access the camera: " +
  //           err
  //       );
  //     }
  //   );
  // } else {
  //   alert("Sorry, browser does not support camera access");
  // }

  if (!navigator.mediaDevices || navigator.mediaDevices.enumerateDevices) {
    alert("enumerateDevices() not supporte");
  }

  navigator.mediaDevices
    .enumerateDevices()
    .then((devices) => {
      devices.forEach(function (device) {
        console.log(
          device.kind + ": " + device.label + " id = " + device.deviceId
        );
      });
    })
    .catch((err) => {
      console.log(err.name + ": " + err.message);
    });

  return (
    <div>
      <Link to="/">
        <Fab style={{ marginRight: 10 }} color="primary">
          <ArrowBack />
        </Fab>
      </Link>
      <span>QR Scanner</span>

      <center>
        <div style={{ marginTop: 30 }}>
          <QrScan
            delay={300}
            facingMode={"user" | "environment"}
            onError={handleError}
            onScan={handleScan}
            style={{ height: 240, width: 320 }}
          />
        </div>
      </center>

      <TextareaAutosize
        style={{ fontSize: 18, width: 320, height: 100, marginTop: 100 }}
        rowsMax={4}
        defaultValue={qrscan}
        value={qrscan}
      />
    </div>
  );
}

export default QRscanner;
