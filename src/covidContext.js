import React, { createContext, useReducer } from 'react';
import covidReducer from './covidReducer';
import {
  GET_COVID,
  GET_VACCINE,
  ERROR,
  LOADING,
  FINISHED_LOADING,
} from './covidTypes';
import axios from 'axios';
import USCords from './data/USstates_avg_latLong.json';

const initialState = {
  covidData: [],
  vaccineData: [],
  loading: true,
  error: false,
};

export const CovidContext = createContext(initialState);

export const UserProvider = ({ children }) => {
  // connects reducer and state
  const [state, dispatch] = useReducer(covidReducer, initialState);

  async function getCovidData() {
    try {
      const res = await axios.get(
        'https://api.covidtracking.com/v1/states/current.json'
      );
      dispatch({ type: GET_COVID, payload: res });
      console.log(res);
    } catch (err) {
      dispatch({ type: ERROR });
    }
  }

  async function getVaccineData() {
    try {
      const res = await axios.get(
        'https://jhucoronavirus.azureedge.net/jhucoronavirus/state_vaccination_rates.json'
      );
      // // Add state coordinates to vaccine data
      // let states = res.data;
      // for (let i = 0; i < states.length; i++) {
      //   console.log(states[i]  .state);
      //   for (let j = 0; j < USCords.length; j++) {
      //     if (states[i].state === USCords[j].state) {
      //       states[i].coordinates = [USCords[j].longitude, USCords[j].latitude];
      //     }
      //   }
      // }
      dispatch({ type: GET_VACCINE, payload: res });
      console.log(res);
    } catch (err) {
      dispatch({ type: ERROR });
      console.log(err);
      console.log('error in getVaccineData()');
    }
  }

  async function getAllData() {
    dispatch({ type: LOADING });
    try {
      const getVac = await axios.get(
        'https://jhucoronavirus.azureedge.net/jhucoronavirus/state_vaccination_rates.json'
      );
      const getCov = await axios.get(
        'https://api.covidtracking.com/v1/states/current.json'
      );

      dispatch({ type: GET_VACCINE, payload: getVac });
      dispatch({ type: GET_COVID, payload: getCov });
    } catch (err) {
      dispatch({ type: ERROR });
      console.log(err);
      console.log('error in getVaccineData()');
    }

    dispatch({ type: FINISHED_LOADING });
  }

  function testFunc() {
    dispatch({ type: FINISHED_LOADING });
  }

  return (
    <CovidContext.Provider
      value={{
        covidData: state.covidData,
        vaccineData: state.vaccineData,
        loading: state.loading,
        error: state.error,
        getCovidData,
        getVaccineData,
        getAllData,
        testFunc,
      }}
    >
      {children}
    </CovidContext.Provider>
  );
};
