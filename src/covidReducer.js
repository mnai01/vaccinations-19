import { ERROR, GET_COVID, GET_VACCINE, LOADING } from './covidTypes';

export default (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_COVID:
      return {
        ...state,
        loading: false,
        covidData: payload.data,
      };

    case GET_VACCINE:
      return {
        ...state,
        loading: false,
        vaccineData: payload.data,
      };
    case ERROR:
    case LOADING:
      return {
        loading: true,
        error: true,
      };
  }
};
