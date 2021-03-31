/// app.js
import React, { useEffect, useContext } from 'react';
import './Map.scss';
import DeckGL from '@deck.gl/react';
import { LineLayer, ScatterplotLayer } from '@deck.gl/layers';
import { StaticMap } from 'react-map-gl';
import { CovidContext } from '../covidContext';
import USCords from '../data/USstates_avg_latLong.json';
import USstatesPoly from '../data/us-states_poly.json';
import randomPointsOnPolygon from 'random-points-on-polygon';
import * as turf from '@turf/turf';
import states from 'us-state-codes';
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
export function Map() {
  console.log('Map');
  const { vaccineData, covidData } = useContext(CovidContext);

  let allVaccinePoints = [];

  vaccineData.map((j) => {
    let points = 0;

    if (j.data.doses_admin !== 0) {
      USstatesPoly.features.map((i) => {
        if (j.state === i.properties.name) {
          if (i.geometry.type === 'Polygon') {
            let polygon = turf.polygon(i.geometry.coordinates);
            points = randomPointsOnPolygon(j.data.doses_admin / 10000, polygon);
          } else if (i.geometry.type === 'MultiPolygon') {
            let multipolygon = turf.multiPolygon(i.geometry.coordinates);
            points = randomPointsOnPolygon(
              j.data.doses_admin / 10000,
              multipolygon
            );
          } else {
            console.log('NOT POLY OR MULTI');
          }
          j.points = points;
          allVaccinePoints.push(...points);
        }
      });
    } else {
      console.log('ERROR DATA', j.state);
    }
  });

  let allCovidPoints = [];

  covidData.map((j) => {
    // If state data is not 0 then execute code
    if (j.positive !== 0) {
      // *API returns data in abbreviation form*
      // Convert State Code from the API to State Name
      let alphaCode = j.state;
      let state = states.getStateNameByStateCode(alphaCode);
      // Maps through polygon list of each state
      USstatesPoly.features.map((i) => {
        let points = 0;
        // if covidData state name equals polygon data state name
        if (state === i.properties.name) {
          if (i.geometry.type === 'Polygon') {
            let polygon = turf.polygon(i.geometry.coordinates);
            points = randomPointsOnPolygon(j.positive / 10000, polygon);
          } else if (i.geometry.type === 'MultiPolygon') {
            let multipolygon = turf.multiPolygon(i.geometry.coordinates);
            points = randomPointsOnPolygon(j.positive / 10000, multipolygon);
          } else {
            console.log('NOT POLY OR MULTI');
          }
          allCovidPoints.push(...points);
        }
      });
    }
  });

  // / 1000
  // const layer = new ScatterplotLayer({
  //   id: 'scatterplot-vaccine-layer',
  //   data: allVaccinePoints,
  //   pickable: true,
  //   opacity: 0.8,
  //   stroked: true,
  //   filled: true,
  //   radiusScale: 1,
  //   radiusMinPixels: 2,
  //   radiusMaxPixels: 10,
  //   lineWidthMinPixels: 1,
  //   getPosition: (d) => d.geometry.coordinates,
  //   getFillColor: (d) => [0, 0, 255],
  //   getLineColor: (d) => [0, 0, 0],
  // });
  // console.log('vaccine', allVaccinePoints);

  const layers = [
    new ScatterplotLayer({
      id: 'scatterplot-covid-layer',
      data: allCovidPoints,
      pickable: true,
      opacity: 0.8,
      stroked: true,
      filled: true,
      radiusScale: 1,
      radiusMinPixels: 2,
      radiusMaxPixels: 10,
      lineWidthMinPixels: 1,
      getPosition: (d) => d.geometry.coordinates,
      getFillColor: (d) => [255, 0, 0],
      getLineColor: (d) => [0, 0, 0],
    }),
    new ScatterplotLayer({
      id: 'scatterplot-vaccine-layer',
      data: allVaccinePoints,
      pickable: true,
      opacity: 0.8,
      stroked: true,
      filled: true,
      radiusScale: 1,
      radiusMinPixels: 2,
      radiusMaxPixels: 10,
      lineWidthMinPixels: 1,
      getPosition: (d) => d.geometry.coordinates,
      getFillColor: (d) => [0, 0, 255],
      getLineColor: (d) => [0, 0, 0],
    }),
  ];

  return (
    <div className='map'>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={layers}
      >
        <StaticMap mapboxApiAccessToken={MAPBOX_TOKEN} />
      </DeckGL>
    </div>
  );
}
