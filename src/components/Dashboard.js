import React, { useContext, useEffect } from 'react';
import { Map } from './Map';
import { CovidContext } from '../covidContext';

const Dashboard = () => {
  const { getVaccineData, getCovidData, loading } = useContext(CovidContext);

  useEffect(() => {
    getCovidData();
    getVaccineData();
  }, []);

  return (
    <div>
      {!loading ? <Map /> : 'loading'}

      <h1>MAP GOES HERE</h1>
    </div>
  );
};
export default Dashboard;
