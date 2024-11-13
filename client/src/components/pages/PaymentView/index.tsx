import React, { useEffect, useState } from 'react';
import './index.scss';
import {
  calculateParkingFee,
  getExchangeRate,
  getParkingAreas,
} from '../../../services';
import Loader from '../../modules/Loader';
import { FormData, ParkingArea, ParkingFee } from '../../../types';

export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  PLN = 'PLN',
}
interface CurrenciesRate {
  EUR: number;
  PLN: number;
  USD: number;
}

const PaymentView = () => {
  const [currenciesRate, setCurrenciesRate] = useState<CurrenciesRate>({
    EUR: 0,
    PLN: 0,
    USD: 0,
  });

  const [activeCurrency, setActiveCurrency] = useState<Currency>(Currency.USD);
  const [areas, setAreas] = useState<ParkingArea[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    selectedArea: '',
    startTime: '',
    endTime: '',
    parkingDate: '',
  });
  const [parkingFee, setParkingFee] = useState<ParkingFee>();
  const [currencyRatesLoaded, setCurrencyRatesLoaded] = useState<boolean>(false);

  const isFormValid =
    formData.selectedArea &&
    formData.startTime &&
    formData.endTime &&
    formData.parkingDate;

  useEffect(() => {
    loadAreas();
    getCurrencyRates();
  }, []);

  const loadAreas = () => {
    setIsLoading(true);
    getParkingAreas()
      .then((res) => {
        setAreas(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        alert('Failed to load area. '+ err.response.data.name);
      });
    };

    const getCurrencyRates = () => {
      setIsLoading(true);
      getExchangeRate()
      .then((res) => {
        setCurrenciesRate(res.data.rates)
        setIsLoading(false);
        setCurrencyRatesLoaded(true);
      })
      .catch(() => {
        alert('Failed to load currencies');
          setIsLoading(false);
      })
    }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    calculateParkingFee({ ...formData, areas })
      .then((res) => {
        setParkingFee(res.data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        alert('Failed to calculate');
      });
  };

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return `${hours}h ${remainingMinutes}min`;
  };

  return (
    <div className="payment-view">
      {isLoading && <Loader />}
      <form onSubmit={handleSubmit} className="payment-view__form">
        <div className="payment-view__select-container">
          <label>Parking area</label>
          <select
            name="selectedArea"
            value={formData.selectedArea}
            onChange={handleChange}
            required
          >
            <option value="">-- Choose --</option>
            {areas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.name}: {area.rate1}$ / {area.rate2}${' '}
                {area.discount ? `(-${area.discount}%)` : ''}
              </option>
            ))}
          </select>
        </div>
        <div className="payment-view__input-container">
          <label>Parking start time</label>
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
          />
        </div>
        <div className="payment-view__input-container">
          <label>Parking end time</label>
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            required
          />
        </div>
        <div className="payment-view__input-container">
          <label>Parking day</label>
          <input
            type="date"
            name="parkingDate"
            value={formData.parkingDate}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className={isFormValid ? '' : 'disabled'}>
          Check fee
        </button>
      </form>

      {parkingFee && (
        <div className="payment-view__output-data">
          <p>Parking time: {formatMinutes(parkingFee.totalTime)}</p>
          {activeCurrency==='USD'&&<p>Parking fee: {parkingFee.totalPrice}$</p>}
          {currencyRatesLoaded && (
            <>
              {activeCurrency===Currency.EUR && <p>Parking fee: {(parkingFee.totalPrice / currenciesRate.USD).toFixed(2)}€</p>}
              {activeCurrency===Currency.PLN && <p>Parking fee: {(parkingFee.totalPrice / currenciesRate.USD*currenciesRate.PLN).toFixed(2)}Zł</p>}
            </>
          )}
          {currencyRatesLoaded && (
            <div className="payment-view__currency-management">
              {Object.keys(Currency).map((key) => (
                  <p
                    key={key}
                    onClick={() =>
                      setActiveCurrency(Currency[key as keyof typeof Currency])
                    }
                    className={`payment-view__currency ${
                      activeCurrency === Currency[key as keyof typeof Currency]
                        ? 'active'
                        : ''
                    }`}
                  >
                    {Currency[key as keyof typeof Currency]}
                  </p>
                ))}
              </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentView;
