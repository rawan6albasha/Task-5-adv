import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Back from '../../Components/Back/Back';
import style from './Show.module.css'

interface Item {
  id: number;
  name: string;
  image_url:File;
  price: number;
  created_at: string; 
  updated_at: string;
}
const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear(); 
  
    return `${day}/${month}/${year}`;
  };

const Show = () => {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
  
    axios.get(`https://test1.focal-x.com/api/items/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((response) => {
        setItem(response.data); // عند النجاح
      })
      .catch((err) => {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || 'Failed to fetch item.');
        } else {
          setError('An unknown error occurred.');
        }
      })
      .finally(() => {
        setLoading(false); // في كل الأحوال يتم إيقاف التحميل
      });
  }, [id]);
  
  

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!item) {
    return <div>No item found.</div>;
  }
  console.log("price",item.price)
console.log("image_url",item.image_url)
console.log("name",item.name)
console.log("id",item.id)

  return (
    <div className={style.show}>
        <Back/>
      <h2 className={style.edit_h2}>{item.name}</h2>
      <div className={style.detail}>     
      <img src={item.image_url} alt={item.name} />
    
      <div  className={style.detail_1}>
      <p>Price: <span> ${item.price}</span></p>
      <p>Added at:<span>  {formatDate(item.created_at)}</span></p>
      </div>
      <p >updated at: <span> {formatDate(item.updated_at)}</span></p>
    
      </div>
    </div>
  );
};

export default Show;
