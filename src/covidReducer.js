import {
  ERROR,
  GET_COVID,
  GET_VACCINE,
  LOADING,
  FINISHED_LOADING,
} from './covidTypes';

export default (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_COVID:
      return {
        ...state,
        error: false,
        covidData: payload.data,
      };

    case GET_VACCINE:
      return {
        ...state,
        error: false,
        vaccineData: payload.data,
      };
    case LOADING:
      return {
        ...state,
        loading: true,
      };
    case ERROR:
      return {
        ...state,
        error: true,
      };
    case FINISHED_LOADING:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
};
