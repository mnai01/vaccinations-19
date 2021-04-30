/// app.js
import React, { useMemo, useState, useContext } from 'react';
import './Map.scss';
import DeckGL from '@deck.gl/react';
import { ScatterplotLayer, GeoJsonLayer } from '@deck.gl/layers';
import { StaticMap } from 'react-map-gl';
// Used to resolve
// Uncaught ReferenceError: y is not defined
// eslint-disable-next-line import/no-webpack-loader-syntax
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';

// Used to resolve
// Uncaught ReferenceError: g is not defined
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

// Viewport settings
const INITIAL_VIEW_STATE = {
  longitude: -87.6500523,
  latitude: 41.850033,
  zoom: 4,
  pitch: 0,
  bearing: 0,
};

// Token
const MAPBOX_TOKEN = process.env.REACT_APP_API_KEY;
const TEST_TOKEN = process.env.REACT_APP_TEST_TOKEN;
console.log(TEST_TOKEN);

export function Map({ covidPoints, vaccinePoints, statesData }) {
  const [hoverInfo, setHoverInfo] = useState();

  const handlersSetHoverInfo = (data) => {
    if (data.object !== undefined) {
      setHoverInfo(data);
      console.log(data);
    }
  };

  const layers = [
    new GeoJsonLayer({
      data: statesData.features,
      opacity: 0.8,
      stroked: false,
      filled: true,
      extruded: true,
      wireframe: true,
      getElevation: (f) => 0,
      // getElevation: (f) => f.properties.density * 100,
      getFillColor: (f) => [
        f.healthData.covidCases ? f.healthData.covidCases.active / 1000 : 255,
        255,
        0,
      ],
      pickable: true,
      onHover: (info) => handlersSetHoverInfo(info),
    }),
    new ScatterplotLayer({
      id: 'scatterplot-covid-layer',
      data: covidPoints,
      pickable: true,
      opacity: 0.8,
      stroked: true,
      filled: true,
      radiusScale: 1,
      radiusMinPixels: 2,
      radiusMaxPixels: 100,
      lineWidthMinPixels: 0,
      getPosition: (d) => d.geometry.coordinates,
      getFillColor: (d) => [255, 0, 0],
      getRadius: 2.5,
      getLineColor: (d) => [0, 0, 0],
    }),
    new ScatterplotLayer({
      id: 'scatterplot-vaccine-layer',
      data: vaccinePoints,
      pickable: true,
      opacity: 0.2,
      stroked: true,
      filled: true,
      radiusScale: 1,
      radiusMinPixels: 2,
      radiusMaxPixels: 100,
      lineWidthMinPixels: 0,
      getPosition: (d) => d.geometry.coordinates,
      getFillColor: (d) => [0, 0, 255],
      getRadius: 2.5,
      getLineColor: (d) => [0, 0, 0],
      // Update app state
    }),
    // new PolygonLayer({
    //   id: 'polygon-layer',
    //   data: statesData.features,
    //   pickable: true,
    //   stroked: true,
    //   filled: true,
    //   wireframe: true,
    //   lineWidthMinPixels: 1,
    //   getPolygon: (d) => d.geometry.coordinates[0],
    //   getElevation: (d) => d.properties.density / 10,
    //   getFillColor: (d) => [d.properties.density / 60, 140, 0],
    //   getLineColor: [80, 80, 80],
    //   getLineWidth: 1,
    // }),
  ];

  return (
    <div className='map'>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={layers}
      >
        {hoverInfo && (
          <div
            style={{
              position: 'absolute',
              zIndex: 1,
              pointerEvents: 'none',
              left: hoverInfo.x,
              top: hoverInfo.y + 15,
              fontWeight: 'bold',
              background: '#f5f5f5',
            }}
          >
            <div>
              <span>
                {hoverInfo.object.healthData.covidCases.state} covid:
                {hoverInfo.object.healthData.covidCases.active}{' '}
              </span>
            </div>
            <div>
              <span>
                {hoverInfo.object.healthData.vaccineCases.data.state} vaccine:
                {hoverInfo.object.healthData.vaccineCases.data.doses_admin}{' '}
              </span>
            </div>
          </div>
        )}
        <StaticMap mapboxApiAccessToken={MAPBOX_TOKEN} />
      </DeckGL>
    </div>
  );
}
export default Map;
