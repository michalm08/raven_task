import axios from 'axios';
import { NewParkingArea, ParkingArea, SendFormData } from '../types';
axios.defaults.baseURL = 'http://localhost:4000';

export const addParkingArea = (payload: NewParkingArea) => {
  return axios({
    method: 'POST',
    url: '/area',
    data: payload,
  });
};

export const getParkingAreas = () => {
  return axios({
    method: 'GET',
    url: '/areas',
  });
};

export const editParkingArea = (payload: ParkingArea) => {
  return axios({
    method: 'PATCH',
    url: '/area',
    data: payload,
  });
};

export const deleteParkingArea = (id: string) => {
  return axios({
    method: 'DELETE',
    url: `/area`,
    data: { id },
  });
};

export const calculateParkingFee = (payload: SendFormData) => {
  return axios({
    method: 'POST',
    url: `/calculate`,
    data: payload,
  });
};

export const getExchangeRate = () => {
  return axios({
    method: 'GET',
    url: `http://api.exchangeratesapi.io/v1/latest`,
    params: {
      access_key: process.env.REACT_APP_API_KEY,
      symbols: 'USD,PLN,EUR',
      base: 'EUR',
    },
  });
};
