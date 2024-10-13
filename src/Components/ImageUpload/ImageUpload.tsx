import React from 'react';
import style from './ImageUpload.module.css';
import upload from './../../assets/img/Upload.png';

interface ImageUploadProps {
  setImage: (file: File | null) => void; // تمرير دالة لتحديث الصورة في المكون الأب
  defaultImg?: string | null;
  edit?: boolean; // تعديل نوع defaultImg ليكون string أو null
}

const ImageUpload: React.FC<ImageUploadProps> = ({ setImage, defaultImg, edit }) => {
  // استخدام useState مع القيمة الافتراضية لـ defaultImg
  const [imageUrl, setImageUrl] = React.useState<string | null>(defaultImg || null);

  // تحديث رابط الصورة في حالة تغير القيمة في props
  React.useEffect(() => {
    setImageUrl(defaultImg || null); // التأكد من عدم تمرير undefined
  }, [defaultImg]);

  return (
    <div className={style.upload_container}>
      <label htmlFor="file-upload" className={`${style.custom_file_upload} ${edit ? style.custom_file_upload_edit : ''}`}>
        <div className={style.upload_icon}>
          {imageUrl ? (
            <img src={imageUrl} alt="Uploaded" className={`${style.uploaded_image} ${edit ? style.uploaded_image_edit : ''}`} />
          ) : (
            <div className={style.upload_icon_overlay}>
              <img src={upload} alt="Upload icon"  className={edit ? style.uploaded_icon_edit : ''}    />
            </div>
          )}
        </div>
        <input
          id="file-upload"
          className={style.file_btn}
          type="file"
          onChange={(event) => {
            const file = event.target.files?.[0] || null;
            setImage(file); // تحديث الصورة في المكون الأب
            setImageUrl(file ? URL.createObjectURL(file) : null); // تحديث رابط عرض الصورة
          }}
        />
      </label>
    </div>
  );
};

export default ImageUpload;
