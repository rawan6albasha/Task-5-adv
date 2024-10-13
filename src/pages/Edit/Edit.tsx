import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ImageUpload from "../../Components/ImageUpload/ImageUpload";
import axios from "axios";

import style from './Edit.module.css'
import Back from "../../Components/Back/Back";
interface Item {
  id: number;
  name: string;
  image_url: string;
  price: string; // تعديل السعر ليكون نصًا
  created_at: string;
  updated_at: string;
}
const Edit = () => {
  const [item, setItem] = useState<Item | null>(null);

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/SignIn");
    }
  }, [navigate]);
  useEffect(() => {
    axios
      .get(`https://test1.focal-x.com/api/items/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setItem(response.data);
        setName(response.data.name);
        setPrice(response.data.price); // تعديل هنا
        setImageUrl(response.data.image_url);

        console.log("Fetched item name:", response.data.name);
      })
      .catch((error) => {
        console.error("Error fetching item:", error);
      });
  }, [id]);

  function send(event: React.FormEvent): void {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);

    // إضافة حقل _method لتحديد أن الطريقة هي PUT
    formData.append("_method", "PUT");

    // إضافة الصورة فقط إذا تم اختيارها
    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    axios
      .post(`https://test1.focal-x.com/api/items/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log("Item updated successfully!");
        console.log(res.data);
        navigate("/");
      })
      .catch((error) => {
        console.log("Error updating item:", error);
      });
  }

  return (
    <div className={style.edit} >
<Back/>
      <h2 className={style.edit_h2}>EDIT ITEM</h2>
      <form onSubmit={send}>
        <div className={style.form_flex}>
          <div className={style.text_flex}>
            <div className={style.label_flex}>
            <label>Name</label>
            <input type="text" placeholder="Name" defaultValue={item?.name} onChange={(event) => { setName(event.target.value);}} />
            </div>
            <div className={style.label_flex}>
              <label>Price</label>
            <input type="text" placeholder="Price" defaultValue={item?.price} onChange={(event) => setPrice(event.target.value)}/>
            </div>
          </div>
          <div className={style.label_flex}>
          <label>Image</label>
          <ImageUpload edit={true} defaultImg={item?.image_url} setImage={setSelectedImage} />
          </div>
        </div>
        <input type="submit" value="Save" className={style.save_btn} />
      </form>
    </div>
  );
};

export default Edit;
