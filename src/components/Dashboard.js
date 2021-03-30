import React, { useContext, useEffect } from 'react';
import { Map } from './Map';
import { CovidContext } from '../covidContext';

const Dashboard = () => {
  console.log('Dashboard');

  const { loading, error, getAllData, vaccineData, covidData } = useContext(
    CovidContext
  );

  useEffect(() => {
    getAllData();
  }, []);

  return (
    <div>
      {!loading && !error ? <Map /> : 'loading'}
      <h1>MAP GOES HERE</h1>
    </div>
  );
};
export default Dashboard;
