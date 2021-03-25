/// app.js
import React, { useEffect, useContext } from 'react';
import DeckGL from '@deck.gl/react';
import { LineLayer, ScatterplotLayer } from '@deck.gl/layers';
import { StaticMap } from 'react-map-gl';
import { CovidContext } from '../covidContext';
import USCords from '../data/USstates_avg_latLong.json';

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

  const data = [
    {
      name: 'Colma (COLM)',
      code: 'CM',
      address: '365 D Street, Colma CA 94014',
      exits: 4214,
      coordinates: [-122.466233, 37.684638],
    },
  ];

  const layer = new ScatterplotLayer({
    id: 'scatterplot-layer',
    data: vaccineData,
    pickable: true,
    opacity: 0.8,
    stroked: true,
    filled: true,
    radiusScale: 1,
    radiusMinPixels: 10,
    radiusMaxPixels: 100,
    lineWidthMinPixels: 1,
    getPosition: (d) => d.coordinates,
    getFillColor: (d) => [255, 140, 0],
    getLineColor: (d) => [0, 0, 0],
  });

  return (
    <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
      layers={[layer]}
    >
      <StaticMap mapboxApiAccessToken={MAPBOX_TOKEN} />
    </DeckGL>
  );
}
