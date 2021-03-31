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

  return <div>{!loading && !error ? <Map /> : 'loading'}</div>;
};
export default Dashboard;
