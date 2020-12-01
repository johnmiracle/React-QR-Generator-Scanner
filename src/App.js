import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  // Link
} from "react-router-dom";
import React, { Component } from "react";
import Home from "./pages/Home";
import QRgen from "./pages/QRgenerator";
// import QRscan from './pages/QRscanner'

// function App() {
//   return (
//     <div className="App">
//       <div className="App-header">

//         <Router>
//           <div>

//             <Switch>
//               <Route exact path="/">
//                 <Home/>
//               </Route>
//               <Route path="/qr_generator">
//                 <QRgen/>
//               </Route>
//               <Route path="/qr_scanner">
//                 <QRscan/>
//               </Route>
//             </Switch>

//           </div>
//         </Router>

//       </div>
//     </div>
//   );
// }

class App extends React.Component {
  state = {
    imageDataURL: null,
  };

  initializeMedia = () => {
    this.setState({ imageDataURL: null });

    if (!("mediaDevices" in navigator)) {
      navigator.mediaDevices = {};
    }

    if (!("getUserMedia" in navigator.mediaDevices)) {
      navigator.mediaDevices.getUserMedia = function (constraints) {
        var getUserMedia =
          navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        if (!getUserMedia) {
          return Promise.reject(new Error("getUserMedia Not Implemented"));
        }

        return new Promise((resolve, reject) => {
          getUserMedia.call(navigator, constraints, resolve, reject);
        });
      };
    }

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        this.player.srcObject = stream;
      })
      .catch((error) => {
        console.error(error);
      });
  };

  capturePicture = () => {
    var canvas = document.createElement("canvas");
    canvas.width = this.player.videoWidth;
    canvas.height = this.player.videoHeight;
    var contex = canvas.getContext("2d");
    contex.drawImage(this.player, 0, 0, canvas.width, canvas.height);
    this.player.srcObject.getVideoTracks().forEach((track) => {
      track.stop();
    });

    console.log(canvas.toDataURL());
    this.setState({ imageDataURL: canvas.toDataURL() });
  };

  render() {
    const playerORImage = Boolean(this.state.imageDataURL) ? (
      <img src={this.state.imageDataURL} />
    ) : (
      <video
        ref={(refrence) => {
          this.player = refrence;
        }}
        autoPlay
      ></video>
    );

    return (
      <div className="App">
        {playerORImage}
        <button onClick={this.initializeMedia}>Take Photo</button>
        <button onClick={this.capturePicture}>Capture</button>
      </div>
    );
  }
}

export default App;
