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
  const { vaccineData, covidData, loading } = useContext(CovidContext);
  console.log(vaccineData);
  // console.log(covidData);
  let allpoints = [];

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
        allpoints.push(...points);
        // console.log(allpoints);
      }
    });
  });

  for (let i = 0; i < vaccineData.length; i++) {
    console.log(vaccineData[i].state);
    for (let j = 0; j < USCords.length; j++) {
      if (vaccineData[i].state === USCords[j].state) {
        vaccineData[i].coordinates = [
          USCords[j].longitude,
          USCords[j].latitude,
        ];
      }
    }
  }

  // / 1000
  const layer = new ScatterplotLayer({
    id: 'scatterplot-layer',
    data: allpoints,
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

  return (
    <div className='map'>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={[layer]}
      >
        <StaticMap mapboxApiAccessToken={MAPBOX_TOKEN} />
      </DeckGL>
    </div>
  );
}
