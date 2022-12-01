import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Button,
  ImageBackground,
  Image,
  StyleSheet,
} from "react-native";
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import * as FaceDetector from "expo-face-detector";

let landmarkSize = 10;

export default function App() {
  //state to hold the array of faces
  const [facesList, setFacesList] = useState([]);

  //updates the state with the list of detected faces
  const handleFacesDetected = async (_faces) => {
    setFacesList(_faces);
    console.log(facesList);
  };

  //renders a single face with a rectangle
  function renderFace({ bounds, faceID, rollAngle, yawAngle }) {
    return (
      <View
        key={faceID}
        transform={[
          { perspective: 600 },
          { rotateZ: `${rollAngle.toFixed(0)}deg` },
          { rotateY: `${yawAngle.toFixed(0)}deg` },
        ]}
        style={[
          styles.face,
          {
            ...bounds.size,
            left: bounds.origin.x,
            top: bounds.origin.y,
          },
        ]}
      >
        <Image
          style={{ width: '100%', height: undefined, aspectRatio: 1, }}
          transform={[{ translateY: -75 },
          { rotateZ: `${rollAngle.toFixed(0)}deg` },
          { rotateY: `${yawAngle.toFixed(0)}deg` },]}
          source={
            require('./assets/santa-hat-40cm.png')
          }
        />
        {/* <Text style={styles.faceText}>ID: {faceID}</Text>
        <Text style={styles.faceText}>rollAngle: {rollAngle.toFixed(0)}</Text>
        <Text style={styles.faceText}>yawAngle: {yawAngle.toFixed(0)}</Text> */}
      </View>
    );
  }

  //renders landmarks, need to set the options to accurate and landmarks from none to all in camera view
  function renderLandmarksOfFace(face) {
    const renderLandmark = (position) =>
      position && (
        <View
          style={[
            styles.landmark,
            {
              left: position.x - landmarkSize / 2,
              top: position.y - landmarkSize / 2,
            },
          ]}
        />
      );
    return (
      <View key={`landmarks-${face.faceID}`}>
        {/* {renderLandmark(face.leftEyePosition)}
        {renderLandmark(face.rightEyePosition)}
        {renderLandmark(face.leftEarPosition)}
        {renderLandmark(face.rightEarPosition)}
        {renderLandmark(face.leftCheekPosition)}
        {renderLandmark(face.rightCheekPosition)}
        {renderLandmark(face.leftMouthPosition)}
        {renderLandmark(face.mouthPosition)}
        {renderLandmark(face.rightMouthPosition)}
        {renderLandmark(face.noseBasePosition)}
        {renderLandmark(face.bottomMouthPosition)} */}
      </View>
    );
  }

  //maps the array of face objects and renders each one with a rectangle
  const renderFaces = () => (
    <View style={styles.facesContainer} pointerEvents="none">
      {console.log(facesList)}
      {facesList.faces.map(renderFace)}
    </View>
  );

  //maps the array of face objects and renders each one with landmark features (little dots)
  const renderLandmarks = () => (
    <View style={styles.facesContainer} pointerEvents="none">
      {facesList.faces.map(renderLandmarksOfFace)}
    </View>
  );

  // FACE DETECTION METHODS END

  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [media_permission, requestMediaPermission] = MediaLibrary.usePermissions();

  const [previewVisible, setPreviewVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  let camera = useRef(null);

  const [type, setType] = useState(Camera.Constants.Type.front);

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
        <Button
          onPress={requestMediaPermission}
          title="grant media permission"
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Camera
        style={{ width: "100%", height: "100%" }}
        type={type}
        ref={(ref) => {
          camera = ref;
        }}
        onFacesDetected={handleFacesDetected}
        faceDetectorSettings={{
          mode: FaceDetector.FaceDetectorMode.accurate,
          detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
          runClassifications: FaceDetector.FaceDetectorClassifications.none,
          minDetectionInterval: 100,
          tracking: true,
        }}
      >
        <View style={styles.cameraView}>
          {/* <View style={styles.menuButtons}>
            <TouchableOpacity
              onPress={() => {
                setType(
                  type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
                );
              }}
              style={styles.buttonView}
            >
              <Text style={{ fontSize: 20 }}>
                Flip Camera
              </Text>
            </TouchableOpacity>
          </View> */}
        </View>
      </Camera>
      {facesList.faces && renderFaces()}
      {facesList.faces && renderLandmarks()}
    </View>
  );
}

const styles = StyleSheet.create({
  detectors: {
    flex: 0.5,
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
  },
  facesContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
  },
  face: {
    padding: 10,
    // borderWidth: 2,
    // borderRadius: 2,
    position: "absolute",
    // borderColor: "black",
    justifyContent: "center",
    // backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  landmark: {
    width: landmarkSize,
    height: landmarkSize,
    position: "absolute",
    backgroundColor: "white",
  },
  faceText: {
    color: "#FFD700",
    fontWeight: "bold",
    textAlign: "center",
    margin: 10,
    backgroundColor: "transparent",
  },
  row: {
    flexDirection: "row",
  },
  cameraView: {
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  menuButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  buttonView: {
    flex: 1,
    height: 50,
    backgroundColor: "skyblue",
    alignItems: "center",
    justifyContent: "center",
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
