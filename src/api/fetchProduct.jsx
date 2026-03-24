import { useEffect, useState } from "react";

export default function useFetchProduct() {
    const [product, setProduct] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
        try {
            const response = await fetch('https://fakestoreapi.com/products')
            const product = await response.json();
            setProduct(product);
            console.log(product);
        } catch (error) {
            setError(error);
            console.error(error);
        }
    };
    fetchData();
}, []);
    return { product, error };
}