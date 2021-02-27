import React, { createContext, useReducer } from 'react';
import covidReducer from './covidReducer';
import { GET_COVID, GET_VACCINE, ERROR, LOADING } from './covidTypes';
import axios from 'axios';

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
      dispatch({ type: LOADING });
      const res = await axios.get(
        'https://api.covidtracking.com/v1/states/current.json'
      );
      dispatch({ type: GET_COVID, payload: res });
    } catch {
      dispatch({ type: ERROR });
      console.log('error in getCovidData()');
    }
  }

  async function getVaccineData() {
    try {
      dispatch({ type: LOADING });
      const res = await axios.get(
        'https://jhucoronavirus.azureedge.net/jhucoronavirus/state_vaccination_rates.json'
      );
      dispatch({ type: GET_VACCINE, payload: res });
    } catch {
      dispatch({ type: ERROR });
      console.log('error in getVaccineData()');
    }
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
      }}
    >
      {children}
    </CovidContext.Provider>
  );
};
