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
interface CurrenciesValue {
  EUR: number;
  PLN: number;
  USD: number;
}

const PaymentView = () => {
  const [currenciesValue, setCurrenciesValue] = useState<CurrenciesValue>({
    EUR: 0,
    PLN: 0,
    USD: 0,
  });
  const [activeCurrency, setActiveCurrency] = useState<Currency>(Currency.USD);
  const [areas, setAreas] = useState<ParkingArea[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    selectedArea: 'areas/35-A',
    startTime: '21:01',
    endTime: '23:01',
    parkingDate: '2024-10-29',
  });
  const [parkingFee, setParkingFee] = useState<ParkingFee>();
  const [isCurrencyRatesLoaded, setIsCurrencyRatesLoaded] = useState(false);

  const isFormValid =
    formData.selectedArea &&
    formData.startTime &&
    formData.endTime &&
    formData.parkingDate;

  const currencySymbols = {
    [Currency.USD]: '$',
    [Currency.EUR]: '€',
    [Currency.PLN]: 'zł',
  };

  useEffect(() => {
    loadAreas();
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const setBasicCurrency = () => {
    setCurrenciesValue({ EUR: 0, PLN: 0, USD: 0 });
    setActiveCurrency(Currency.USD);
    setIsCurrencyRatesLoaded(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBasicCurrency();

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

  const changeCurrency = (e: React.MouseEvent<HTMLParagraphElement>) => {
    const selectedCurrency = e.currentTarget.textContent as Currency;
    setActiveCurrency(selectedCurrency);

    if (!isCurrencyRatesLoaded) {
      setIsLoading(true);
      getExchangeRate()
        .then((res) => {
          setIsCurrencyRatesLoaded(true);
          const latestCurrencyRates = res.data.rates;

          if (!parkingFee) return;
          const priceInUSD = Number(parkingFee.totalPrice);
          const priceInEUR = priceInUSD / latestCurrencyRates.USD;
          const priceInPLN = priceInEUR * latestCurrencyRates.PLN;

          setCurrenciesValue({
            EUR: priceInEUR,
            USD: priceInUSD,
            PLN: priceInPLN,
          });
          setIsLoading(false);
        })
        .catch(() => {
          alert('Failed to load currencies');
          setIsLoading(false);
        });
    }
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
          <p>
            Parking fee:{' '}
            {currenciesValue[activeCurrency]
              ? currenciesValue[activeCurrency].toFixed(2)
              : parkingFee.totalPrice}
            {currenciesValue[activeCurrency]
              ? currencySymbols[activeCurrency]
              : currencySymbols.EUR}
          </p>
          <div className="payment-view__currency-management">
            {Object.values(Currency).map((currency) => (
              <p
                key={currency}
                className={`payment-view__currency ${
                  activeCurrency === currency ? 'active' : ''
                }`}
                onClick={changeCurrency}
              >
                {currency}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentView;
