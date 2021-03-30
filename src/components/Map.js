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
  longitude: -122.466233,
  latitude: 37.684638,
  zoom: 13,
  pitch: 0,
  bearing: 0,
};

// Token
const MAPBOX_TOKEN = process.env.REACT_APP_API_KEY;
export function Map() {
  console.log('Map');
  const { vaccineData, covidData, clickFunc } = useContext(CovidContext);
  console.log(vaccineData);
  console.log(covidData);
  let allVaccinePoints = [];

  vaccineData.map((j) => {
    USstatesPoly.features.map((i) => {
      if (j.state === i.properties.name) {
        if (i.geometry.type === 'Polygon') {
          let polygon = turf.polygon(i.geometry.coordinates);
          var points = randomPointsOnPolygon(
            j.data.doses_admin / 10000,
            polygon
          );
        } else if (i.geometry.type === 'MultiPolygon') {
          let multipolygon = turf.multiPolygon(i.geometry.coordinates);
          var points = randomPointsOnPolygon(
            j.data.doses_admin / 10000,
            multipolygon
          );
        } else {
          console.log('NOT POLY OR MULTI');
        }
        j.points = points;
        allVaccinePoints.push(...points);
        // console.log(allVaccinePoints);
      }
    });
  });

  let allCoivdPoints = [];

  covidData.map((j) => {
    let alphaCode = j.state;
    j.state = states.getStateNameByStateCode(alphaCode);
    console.log(j.state, states.getStateNameByStateCode(alphaCode));
  });

  covidData.map((j) => {
    USstatesPoly.features.map((i) => {
      if (j.state === i.properties.name) {
        if (i.geometry.type === 'Polygon') {
          let polygon = turf.polygon(i.geometry.coordinates);
          var points = randomPointsOnPolygon(j.positive / 10000, polygon);
        } else if (i.geometry.type === 'MultiPolygon') {
          let multipolygon = turf.multiPolygon(i.geometry.coordinates);
          var points = randomPointsOnPolygon(j.positive / 10000, multipolygon);
        } else {
          console.log('NOT POLY OR MULTI');
        }
        allCoivdPoints.push(...points);
        console.log(allCoivdPoints, j.state);
      }
    });
  });

  // / 1000
  const layer = new ScatterplotLayer({
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
  });

  const covid_Layer = new ScatterplotLayer({
    id: 'scatterplot-covid-layer',
    data: allCoivdPoints,
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
  });

  return (
    <div className='map'>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={[covid_Layer]}
      >
        <StaticMap mapboxApiAccessToken={MAPBOX_TOKEN} />
      </DeckGL>
    </div>
  );
}
