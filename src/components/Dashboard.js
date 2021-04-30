import React, { useContext, useEffect } from 'react';
import Map from './Map';
import { CovidContext } from '../covidContext';
import randomPointsOnPolygon from 'random-points-on-polygon';
import * as turf from '@turf/turf';
import USstatesPoly from '../data/us-states_poly.json';

const Dashboard = () => {
  console.log('Dashboard');

  const { loading, error, getAllData, vaccineData, covidData } = useContext(
    CovidContext
  );

  let allVaccinePoints = [];

  vaccineData.map((j) => {
    let points = 0;
    if (j.data.doses_admin !== 0) {
      USstatesPoly.features.map((i, index) => {
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
          allVaccinePoints.push(...points);
          USstatesPoly.features[index] = {
            ...i,
            healthData: { vaccineCases: { ...j } },
          };
        }
      });
    } else {
      console.log('ERROR DATA', j.state);
    }
  });

  let allCovidPoints = [];

  covidData.map((j) => {
    // If state data is not 0 then execute code
    if (j.active !== 0) {
      // Maps through polygon list of each state
      USstatesPoly.features.map((i, index) => {
        let points = 0;
        // if covidData state name equals polygon data state name
        if (j.state === i.properties.name) {
          if (i.geometry.type === 'Polygon') {
            let polygon = turf.polygon(i.geometry.coordinates);
            points = randomPointsOnPolygon(
              j.active / 10000 < 1 ? 1 : j.active / 10000,
              polygon
            );
          } else if (i.geometry.type === 'MultiPolygon') {
            let multipolygon = turf.multiPolygon(i.geometry.coordinates);
            points = randomPointsOnPolygon(
              j.active / 10000 < 1 ? 1 : j.active / 10000,
              multipolygon
            );
          } else {
            console.log('NOT POLY OR MULTI');
          }
          allCovidPoints.push(...points);
          USstatesPoly.features[index] = {
            ...i,
            healthData: { ...i.healthData, covidCases: { ...j } },
          };
          console.log(i);
        }
      });
    }
  });

  useEffect(() => {
    getAllData();
  }, []);

  return (
    <div>
      {!loading && !error ? (
        <Map
          covidPoints={allCovidPoints}
          vaccinePoints={allVaccinePoints}
          statesData={USstatesPoly}
        />
      ) : (
        'loading'
      )}
    </div>
  );
};
export default Dashboard;
