import './HistoryPage.css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IDeliveryFeeData } from '../../interfaces/DeliveryFeeData.interface';
import {
  fetchLocalStorage,
  removeAllLocalStorage,
} from '../../functionality/localStotage';
import HistoryCard from '../historyCard/HistoryCard';
import NavBar from '../navBar/NavBar';

const HistoryPage: React.FC = (): JSX.Element => {
  const navigate = useNavigate();
  const [data, setData] = useState<IDeliveryFeeData[]>([]);

  // fetch the history data from localStorage
  useEffect(() => {
    const data = fetchLocalStorage();
    setData(data);
  }, []);

  return (
    <div className='root-container'>
      <NavBar />
      <div
        className='history-delete-all-btn btn'
        data-testid='delete-all'
        onClick={() => {
          if (window.confirm('Are you sure you want to delete all items')) {
            removeAllLocalStorage();
            navigate('/');
          }
        }}
      >
        <span>DELETE ALL</span>
      </div>
      <div className='history-container'>
        <div className='history-card-grid'>
          {data
            .map((el: IDeliveryFeeData) => {
              return (
                <HistoryCard
                  key={el.id}
                  id={el.id}
                  cartValue={el.cartValue}
                  distance={el.distance}
                  itemsAmount={el.itemsAmount}
                  userDate={el.userDate}
                  deliveryPrice={el.deliveryPrice}
                />
              );
            })
            // reverse data array
            .reverse()}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
