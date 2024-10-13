import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import style from './Dashboard.module.css';
import axios from 'axios';
import Pagination from '../../Components/Pagination/Pagination';

const Dashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // تحقق من بيانات المستخدم
        if (!localStorage.getItem("token")) {
            navigate("/SignIn");
        }
    }, [navigate]);

    const [allProducts, setAllProducts] = useState<any[]>([]);  // لتخزين جميع المنتجات
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(8);  // عدد العناصر لكل صفحة (قابل للتغيير)
    const [showPopup, setShowPopup] = useState(false); // حالة لتتبع ظهور الـ popup
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null); // لتتبع المنتج المراد حذفه
    const [error, setError] = useState<string | null>(null); // لتتبع حالة الخطأ إن وجدت

    // تحديث itemsPerPage بناءً على عرض الشاشة
    useEffect(() => {
        const updateItemsPerPage = () => {
            if (window.innerWidth <= 991 && window.innerWidth >= 466) {
                setItemsPerPage(2); // إذا كان العرض أقل من أو يساوي 991px
            }
            else if  (window.innerWidth <= 465) {
                setItemsPerPage(1); // إذا كان العرض أقل من أو يساوي 991px
            }
            else {
                setItemsPerPage(8); // إذا كان العرض أكبر من 991px
            }
        };

        updateItemsPerPage(); // تحديث في أول تحميل
        window.addEventListener('resize', updateItemsPerPage); // استماع لتغييرات الحجم

        return () => {
            window.removeEventListener('resize', updateItemsPerPage); // تنظيف الحدث عند إلغاء تحميل المكون
        };
    }, []);

    useEffect(() => {
        const fetchProducts = () => {
            setLoading(true);
            axios.get('https://test1.focal-x.com/api/items', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            })
            .then((response) => {
                console.log("Fetched data:", response.data);
                setAllProducts(response.data || []);  // تخزين جميع المنتجات في حالة واحدة
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
            })
            .finally(() => {
                setLoading(false);
            });
        };

        fetchProducts();
    }, []);

    // حساب العناصر الحالية لعرضها بناءً على الصفحة الحالية
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = allProducts.slice(indexOfFirstItem, indexOfLastItem);  // تقطيع المصفوفة

    // تغيير الصفحة
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // لفتح الـ popup وتحديد المنتج
    const handleDeleteClick = (productId: number) => {
        setSelectedProductId(productId);
        setShowPopup(true);
    };

    // إغلاق الـ popup بدون حذف
    const handleCancel = () => {
        setShowPopup(false);
        setSelectedProductId(null);
    };

    // تنفيذ الحذف
    const handleConfirmDelete = () => {
        if (!selectedProductId) return; // تأكد من أن هناك منتجًا محددًا
  
        // إرسال طلب DELETE للـ API
        axios.delete(`https://test1.focal-x.com/api/items/${selectedProductId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        .then(() => {
            // عند نجاح الحذف
            setAllProducts(allProducts.filter(product => product.id !== selectedProductId)); // تحديث قائمة المنتجات بعد الحذف
            setShowPopup(false);
            setSelectedProductId(null);
            console.log('Product deleted successfully!');
        })
        .catch(() => {
            setError('Failed to delete the product.'); // في حالة حدوث خطأ
        });
    };

    if (loading) {
        return <h2>Loading...</h2>;
    }

    return (
        <div className={style.dashbord}>
            <input type='text' className={style.search} placeholder='Search product by name' />
            <div className={style.left_btn}>
                <Link className={style.add_btn} to='add'>ADD NEW PRODUCT</Link>
                <div className={style.pagination}>
                    <div className={style.products}>
                        {currentProducts.length > 0 ? currentProducts.map(product => (
                            <div key={product.id} className={style.product_card}>
                                <Link to={`/show/${product.id}`}>
                                    {product.image_url ? <img src={product.image_url} alt={product.name} /> : <div>No Image</div>}
                                    <div className={style.layout}>
                                        <p className={style.pord_name}>{product.name}</p>
                                        <div className={style.btns_layout}>
                                            <Link className={style.edit_btn} to={`/edit/${product.id}`}>Edit</Link>
                                            <Link className={style.delete_btn} to='#' onClick={() => handleDeleteClick(product.id)}>Delete</Link>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        )) : <p>No products found.</p>}
                    </div>
                    
                    {showPopup && (
                        <div className={style.popup_body}>
                            <div className={style.popup}>
                                <h3>Are you sure you want to delete this item?</h3>
                                {error && <p style={{ color: 'red' }}>{error}</p>} {/* عرض رسالة الخطأ */}
                                <div className={style.popup_buttons}>
                                    <button onClick={handleCancel}>No</button>
                                    <button onClick={handleConfirmDelete}>Yes</button>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <Pagination
                        itemsPerPage={itemsPerPage}
                        totalItems={allProducts.length}  // تمرير العدد الإجمالي للعناصر
                        paginate={paginate}
                        currentPage={currentPage}
                    />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
