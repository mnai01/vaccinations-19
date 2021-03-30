import React, { useState, useMemo, useContext, useEffect } from 'react';
import { CovidContext } from '../covidContext';

// function test(num) {
//   let x = num + 1;
//   return x;
// }

export const Test = () => {
  //   const num = 2;
  // used for optimization so this function wont be called on re-render
  // only is called when dependencies change
  // 1st param is function which returns the data
  // 2nd param is array of dependencies
  //   const value = useMemo(() => test(), [test(), num]);

  //   console.log(value);

  const {
    vaccineData,
    covidData,
    getVaccineData,
    getCovidData,
    error,
    loading,
    changeState,
    testFunc,
  } = useContext(CovidContext);

  // useEffect(() => {
  //   getCovidData();
  //   getVaccineData();
  // }, []);

  if (!loading) {
    console.log(covidData);
    console.log(error);
  }
  console.log(error);

  return (
    <div>
      <h1>test</h1> <h1>{error}</h1>testkFunc
      <button onClick={() => testFunc()}>Click me</button>
    </div>
  );
};
