import { useState, useEffect } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";

function FarmerDashboard() {
    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);


    const [form, setForm] = useState({
        name: "",
        price: "",
        quantity: "",
        description: "",
    });

    const [products, setProducts] = useState([]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const fetchProducts = async () => {
        try {
            const res = await api.get("/products/my");
            setProducts(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const restockProduct = async (id) => {
        const qty = prompt("Enter quantity to add:");

        if (!qty) return;

        try {
            await api.patch(`/products/${id}/restock`, {
                quantity: qty,
            });
            fetchProducts();
        } catch (err) {
            alert("Restock failed");
        }
    };


    useEffect(() => {
        fetchProducts();
    }, []);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        const newImages = [...images, ...files].slice(0, 10);
        setImages(newImages);

        const newPreviews = newImages.map((file) =>
            URL.createObjectURL(file)
        );
        setPreviews(newPreviews);
    };

    const removeImage = (index) => {
        const updatedImages = images.filter((_, i) => i !== index);
        setImages(updatedImages);

        const updatedPreviews = updatedImages.map((file) =>
            URL.createObjectURL(file)
        );
        setPreviews(updatedPreviews);
    };



    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("price", form.price);
            formData.append("quantity", form.quantity);
            formData.append("description", form.description);

            for (let i = 0; i < images.length; i++) {
                formData.append("images", images[i]);
            }

            await api.post("/products", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            fetchProducts();
        } catch (err) {
            alert("Upload failed");
        }
    };



    return (
        <Layout>
            <div className="max-w-5xl mx-auto">
                <h2 className="text-2xl font-bold mb-6">Farmer Dashboard</h2>

                {/* Add product card */}
                <div className="bg-white p-6 rounded shadow mb-8">
                    <h3 className="text-lg font-semibold mb-4">Add Product</h3>
                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                        <input
                            name="name"
                            placeholder="Product name"
                            value={form.name}
                            onChange={handleChange}
                            className="border p-2 rounded"
                        />
                        <input
                            name="price"
                            placeholder="Price"
                            value={form.price}
                            onChange={handleChange}
                            className="border p-2 rounded"
                        />
                        <input
                            name="quantity"
                            placeholder="Quantity"
                            value={form.quantity}
                            onChange={handleChange}
                            className="border p-2 rounded"
                        />
                        <textarea
                            name="description"
                            placeholder="Product description"
                            value={form.description}
                            onChange={handleChange}
                            className="border p-2 rounded col-span-full"
                        />

                        <div className="flex gap-3 mb-4 flex-wrap">
                            {previews.map((src, index) => (
                                <div
                                    key={index}
                                    className="relative w-24 h-24 border rounded"
                                >
                                    <img
                                        src={src}
                                        alt="preview"
                                        className="w-full h-full object-cover rounded"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}

                            {images.length < 10 && (
                                <label className="w-24 h-24 border-dashed border-2 flex items-center justify-center cursor-pointer rounded text-2xl">
                                    +
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        capture="environment"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>



                        <button className="bg-green-600 text-white p-2 rounded col-span-full">
                            Add Product
                        </button>
                    </form>
                </div>

                {/* Product cards */}
                <h3 className="text-lg font-semibold mb-4">My Products</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {products.map((p) => (
                        <div
                            key={p._id}
                            className="bg-white p-4 rounded shadow"
                        >
                            <h4 className="text-lg font-bold">{p.name}</h4>
                            <p className="text-gray-600">₹{p.price}</p>
                            <p className="text-sm text-gray-500">
                                Stock: {p.quantity}
                            </p>
                            <button
                                onClick={() => restockProduct(p._id)}
                                className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
                            >
                                Restock
                            </button>
                            <p className="text-sm mt-2">{p.description}</p>

                            <button
                                onClick={() => deleteProduct(p._id)}
                                className="mt-3 bg-red-500 text-white px-3 py-1 rounded"
                            >
                                Delete
                            </button>
                        </div>

                    ))}
                </div>
            </div>
        </Layout>
    );
}

export default FarmerDashboard;
