import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageUpload from "../../Components/ImageUpload/ImageUpload";
import axios from "axios";
import Back from "../../Components/Back/Back";
import style from './../Edit/Edit.module.css'

const Add = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("");

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/SignIn");
    }
  }, [navigate]);
  function send(event: React.FormEvent): void {
    event.preventDefault();
    axios
      .post(
        "https://test1.focal-x.com/api/items",
        {
          name: name,
          price: price,
          image: selectedImage,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        console.log("added down!!");
        console.log(res.data);
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div className={style.edit} >
    <Back/>
          <h2 className={style.edit_h2}>ADD NEW ITEM</h2>
          <form onSubmit={send}>
            <div className={style.form_flex}>
              <div className={style.text_flex}>
                <div className={style.label_flex}>
                <label>Name</label>
                <input type="text"placeholder="Enter the product name"onChange={(event) => {setName(event.target.value);}}/>
                </div>
                <div className={style.label_flex}>
                  <label>Price</label>
                  <input type="text" placeholder="Enter the product price"onChange={(event) => setPrice(event.target.value)}/>
                  </div>
              </div>
              <div className={style.label_flex}>
              <label>Image</label>
              <ImageUpload edit={true} setImage={setSelectedImage} />
              </div>
            </div>
            <input type="submit" value="Save" className={style.save_btn} />
          </form>
        </div>

  );
};

export default Add;
