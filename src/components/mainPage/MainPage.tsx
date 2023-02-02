import './MainPage.css';
import React, { useState } from 'react';
import NavBar from '../navBar/NavBar';
import moment from 'moment-timezone';
import calculateDeliveryFee from '../../functionality/calculations';
import { RiMoneyEuroCircleLine } from 'react-icons/ri';
import { updateLocalStorage } from '../../functionality/localStotage';

const MainPage: React.FC = (): JSX.Element => {
  const [cartValue, setCartValue] = useState(0);
  const [distance, setDistance] = useState(0);
  const [itemsAmount, setItemsAmount] = useState(0);
  const [userDate, setUserDate] = useState('');
  const [utcDate, setUtcDate] = useState(moment);
  const [deliveryPrice, setDeliveryPrice] = useState(0);

  const handleInput: React.ChangeEventHandler<HTMLInputElement> = (e): void => {
    const { id, value } = e.target;

    if (id === 'date') {
      setUserDate(value);
      setUtcDate(fundTimeZoneConverTimeToUTC(value));
    }
    if (value.length >= 17) {
      return;
    }
    if (!Number(value) && value !== '') {
      return;
    }
    if (id === 'cartValue') {
      setCartValue(Number(value));
    }
    if (id === 'distance') {
      setDistance(Number(value));
    }
    if (id === 'itemsAmount') {
      setItemsAmount(Number(value));
    }
  };

  const fundTimeZoneConverTimeToUTC = (time: string) => {
    // get timezone from browser
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // create date with browser timezon
    const date = moment(time).tz(tz);
    // return date with UTC format
    return moment(date.utc().format());
  };

  const calculateDeliveryHandler = () => {
    if (cartValue === 0 || distance === 0 || itemsAmount === 0) return;

    const id = moment().format();

    const deliveryPrice = calculateDeliveryFee({
      id,
      cartValue,
      distance,
      itemsAmount,
      utcDate,
    });

    setDeliveryPrice(deliveryPrice);

    updateLocalStorage({
      id,
      cartValue,
      distance,
      itemsAmount,
      userDate,
      deliveryPrice,
    });
  };

  const handleRefresh = () => {
    setCartValue(0);
    setDistance(0);
    setItemsAmount(0);
    setUserDate('');
    setUtcDate(moment);
    setDeliveryPrice(0);
  };

  return (
    <div className='root-container'>
      <NavBar />
      <div className='calculator-container'>
        <div className='calculator-logo btn'>
          <span>Delivery Fee Calculator</span>
        </div>
        <div className='calculator-inputs'>
          <div>
            <span className='input-name'>Cart value</span>
          </div>
          <div>
            <span className='input-body'>
              <input
                type='text'
                id='cartValue'
                value={cartValue}
                onChange={handleInput}
              />
              <RiMoneyEuroCircleLine size={30} />
            </span>
          </div>
          <div>
            <span className='input-name'>Delivery distance</span>
          </div>
          <div>
            <span className='input-body delivery-icon'>
              <input
                type='text'
                id='distance'
                value={distance}
                onChange={handleInput}
              />
              m
            </span>
          </div>
          <div>
            <span className='input-name'>Amount of items</span>
          </div>
          <div>
            <span className='input-body'>
              <input
                type='text'
                id='itemsAmount'
                value={itemsAmount}
                onChange={handleInput}
              />
            </span>
          </div>
          <div>
            <span className='input-name'>Time</span>
          </div>
          <div>
            <span className='input-body'>
              <input
                className='date-input'
                id='date'
                type='datetime-local'
                value={userDate}
                onChange={handleInput}
              />
            </span>
          </div>
        </div>
        <div className='calculator-btn'>
          <div
            className='btn-calculate btn'
            onClick={() => calculateDeliveryHandler()}
          >
            <span>Calculate delivery price</span>
          </div>
          <div className='btn-refresh btn' onClick={() => handleRefresh()}>
            <span>Refresh</span>
          </div>
        </div>
        <div className='calculator-result'>
          <div>
            <span>Delivery price</span>
            <div>
              <span>= {deliveryPrice}</span>
              <RiMoneyEuroCircleLine size={30} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
