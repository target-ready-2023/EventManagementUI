import axios from 'axios'
import { useState } from 'react';

const instance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
  });
  
const useEventData = () => {
  const [tableData, setTableData] = useState([]);

  const loadEvents = async () => {
    try {
      const response = await instance.get('/api/events');
      const sortedData = response.data.data.sort((a, b) => b.id - a.id);
      setTableData(sortedData);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return { instance, tableData, setTableData, loadEvents };
};

export default useEventData;





