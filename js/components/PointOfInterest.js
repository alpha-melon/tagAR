"use strict";
import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import {
  ViroARScene,
  ViroText,
  ViroImage,
  Viro3DObject,
  ViroAmbientLight
} from "react-viro";
import axios from "axios";

export default class PointOfInterest extends Component {
  constructor() {
    super();

    // Set initial state here
    this.state = {
      text: "Initializing AR...",
      error: null,
      POIs: [],
      latitude: 0,
      longitude: 0,
      farPOIs: []
    };

    // bind 'this' to functions
    this._onInitialized = this._onInitialized.bind(this);
    this._latLongToMerc = this._latLongToMerc.bind(this);
    this._transformPointToAR = this._transformPointToAR.bind(this);
    this.onClickName = this.onClickName.bind(this);
  }

  async componentDidMount() {
    // get location info for device
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null
        });
      },
      error => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );

    // get API info from backend for POIs
    let { data } = await axios.get(
      "http://172.16.23.1:8080/api/pointsOfInterest"
    );
    //add fullview
    data = data.map(poi => {
      poi.fullView = false;
      return poi;
    });

    this.setState({ POIs: data });

    //Creating new set of POIs based on far distance
    // this.state.POIs.filter(elem => elem.longitude > 300)

    let tempArr = this.state.POIs.map(poi => {
      let point = this._transformPointToAR(poi.latitude, poi.longitude);
      poi.x = point.x;
      poi.z = point.z;
      return poi;
    });

    tempArr = tempArr.filter(
      poi => Math.abs(poi.x) > 140 || Math.abs(poi.z) > 140
    );
    console.warn(tempArr, "NEW ARRRRAYYY");
    this.setState({ farPOIs: tempArr });
  }

  onClickName(id) {
    let copyPOI = this.state.POIs;
    copyPOI.map(poi => {
      if (poi.id === id) {
        poi.fullView = !poi.fullView;
      }
      return poi;
    });
    this.setState({ POIs: copyPOI });
  }

  render() {
    return (
      <ViroARScene onTrackingInitialized={this._onInitialized}>
        {/* POI NAME */}
        {this.state.POIs.map(poi => {
          return (
            <ViroText
              onClick={() => this.onClickName(poi.id)}
              transformBehaviors={["billboard"]}
              key={poi.id}
              text={String(poi.name)}
              extrusionDepth={8}
              scale={[3, 3, 3]}
              position={(() => {
                let point = this._transformPointToAR(
                  poi.latitude,
                  poi.longitude
                );
                return [point.x, 2, point.z];
              })()}
              style={styles.helloWorldTextStyle}
            />
          );
        })}
        {/* POI DESCRIPTION */}
        {this.state.POIs.map(poi => {
          if (poi.fullView) {
            return (
              <ViroText
                transformBehaviors={["billboard"]}
                key={poi.id}
                text={String(poi.description)}
                extrusionDepth={2}
                height={3}
                width={3}
                scale={[3, 3, 3]}
                textAlignVertical="top"
                textLineBreakMode="justify"
                textClipMode="clipToBounds"
                position={(() => {
                  let point = this._transformPointToAR(
                    poi.latitude,
                    poi.longitude
                  );
                  return [point.x, -4, point.z];
                })()}
                style={styles.descriptionTextStyle}
              />
            );
          }
        })}
        {/* POI IMAGE */}
        {this.state.POIs.map(poi => {
          if (poi.fullView) {
            return (
              <ViroImage
                transformBehaviors={["billboard"]}
                key={poi.id}
                source={{ uri: poi.imageUrl }}
                scale={[5, 5, 5]}
                position={(() => {
                  let point = this._transformPointToAR(
                    poi.latitude,
                    poi.longitude
                  );
                  return [point.x, 7, point.z];
                })()}
              />
            );
          }
        })}
        {this.state.farPOIs.map(poi => {
          return (
            <ViroText
              transformBehaviors={["billboard"]}
              key={poi.id}
              text={String(poi.name)}
              extrusionDepth={8}
              scale={[3, 3, 3]}
              position={(() => {
                let point = this._transformPointToAR(
                  poi.latitude,
                  poi.longitude
                );
                return [point.x * 0.05, 0, point.z * 0.05];
              })()}
              style={styles.helloWorldTextStyle}
            />
          );
        })}
        {this.state.farPOIs.map(poi => {
          return (
            <ViroText
              transformBehaviors={["billboard"]}
              key={poi.id}
              text="!"
              extrusionDepth={8}
              scale={[15, 15, 15]}
              position={(() => {
                let point = this._transformPointToAR(
                  poi.latitude,
                  poi.longitude
                );
                return [point.x * 0.05, 3, point.z * 0.05];
              })()}
              style={styles.helloWorldTextStyle}
            />
          );
        })}
      </ViroARScene>
    );
  }

  _onInitialized() {}

  _latLongToMerc(lat_deg, lon_deg) {
    var lon_rad = (lon_deg / 180.0) * Math.PI;
    var lat_rad = (lat_deg / 180.0) * Math.PI;
    var sm_a = 6378137.0;
    var xmeters = sm_a * lon_rad;
    var ymeters = sm_a * Math.log((Math.sin(lat_rad) + 1) / Math.cos(lat_rad));
    return { x: xmeters, y: ymeters };
  }

  _transformPointToAR(lat, long) {
    var objPoint = this._latLongToMerc(lat, long);
    // var devicePoint = this._latLongToMerc(
    //   this.state.latitude,
    //   this.state.longitude
    // );
    var devicePoint = this._latLongToMerc(40.7049444, -74.0091771);
    // latitude(north,south) maps to the z axis in AR
    // longitude(east, west) maps to the x axis in AR
    var objFinalPosZ = objPoint.y - devicePoint.y;
    var objFinalPosX = objPoint.x - devicePoint.x;
    //flip the z, as negative z(is in front of us which is north, pos z is behind(south).
    return { x: objFinalPosX, z: -objFinalPosZ };
  }
}

var styles = StyleSheet.create({
  helloWorldTextStyle: {
    fontFamily: "Arial",
    fontSize: 30,
    color: "#000000",
    textAlignVertical: "center",
    textAlign: "center"
  },
  descriptionTextStyle: {
    fontFamily: "Arial",
    fontSize: 15,
    color: "#FFFFFF",
    fontStyle: "italic",
    textAlign: "center"
  }
});

module.exports = PointOfInterest;
