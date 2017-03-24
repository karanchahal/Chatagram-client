
import React, { Component } from 'react';
import { Link } from 'react-router'
import _ from 'lodash'
import { withGoogleMap,GoogleMap,InfoWindow,Marker,fancyMapStyles } from "react-google-maps";


const PopUpInfoWindowExampleGoogleMap = withGoogleMap(props => (
  <GoogleMap
    defaultZoom={12}
    defaultOptions={{ styles: fancyMapStyles }}
    center={props.center}
  >
    {props.markers.map((marker, index) => (
      <Marker
        key={index}
        position={marker.position}
        onClick={() => props.onMarkerClick(marker)}
      >

        {marker.showInfo && (
          <InfoWindow onCloseClick={() => props.onMarkerClose(marker)}>
            <div>{marker.infoContent}</div>
          </InfoWindow>
        )}
      </Marker>
    ))}
  </GoogleMap>
));



 class MapBubble extends Component {
   constructor(props) {
     super(props)

     this.state = {
      center: {lat: 28.604009 ,lng: 77.048278},
      markers: this.props.markers
     }
     this.handleMarkerClick = this.handleMarkerClick.bind(this);
     this.handleMarkerClose = this.handleMarkerClose.bind(this);
   }


   handleMarkerClick(targetMarker) {
     this.setState({
       markers: this.state.markers.map(marker => {
         if (marker === targetMarker) {
           return {
             ...marker,
             showInfo: true,
           };
         }
         return marker;
       }),
     });
   }

   handleMarkerClose(targetMarker) {
     this.setState({
       markers: this.state.markers.map(marker => {
         if (marker === targetMarker) {
           return {
             ...marker,
             showInfo: false,
           };
         }
         return marker;
       }),
     });
   }

   render() {


     return (
       <PopUpInfoWindowExampleGoogleMap
          containerElement={
            <div style={{ height: `100%` }} />
          }
          mapElement={
            <div style={{ height: `100%`,width: `50%` }} />
          }
          center={this.state.center}
          markers={this.state.markers}
          onMarkerClick={this.handleMarkerClick}
          onMarkerClose={this.handleMarkerClose}
      />
     )
   }
 }


 export default MapBubble
