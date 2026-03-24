import styles from './shop.module.css'
import useFetchProduct from '../../api/fetchProduct'
import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';

export default function Shop() {
  const { setItemsInCart } = useOutletContext();
  const { product, error } = useFetchProduct();
  const [quantity, setQuantity] = useState({});

  function handleAddToCart(item) {
    const qty = quantity[item.id] ?? 1;
    setItemsInCart((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists) {
        return prev.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + qty } : i);
      }
      return [...prev, {...item, quantity: qty}];
  });
}

  function increaseQuantity(id) {
    setQuantity((prev) => ({ ...prev, [id]: (prev[id] ?? 1) + 1}));
  };

  function decreaseQuantity(id) {
    setQuantity((prev) => {
      const current = prev[id] ?? 1;
      return { ...prev, [id]: Math.max(1, current - 1)};
    });
  }

  if (error) return <div>Error: {error.message}</div>
  if (!product) return <div className={styles.loading}>Loading</div>

    return (
      <div className={styles.shop}>
        {product.map((item) => (
          <div className={styles.itemCard} key={item.id}>
            <img className={styles.imagePlaceholder} src={item.image} alt={item.title}/>
            <div className={styles.cardBody}>
              <p className={styles.itemName}>{item.title}</p>
              <p className={styles.itemPrice}>${item.price}</p>
              <div className={styles.quantity}>
                <button className={styles.decrement} onClick={() => decreaseQuantity(item.id)}>-</button>
                <input 
                  type="number" 
                  min={1} 
                  className={styles.qtyInput} 
                  value={quantity[item.id] ?? 1}
                  onChange={(e) => setQuantity((prev) => ({ ...prev, [item.id]: Number(e.target.value)}))}
                  />
                <button className={styles.increment} onClick={() => increaseQuantity(item.id)}>+</button>
              </div>
              <button className={styles.addItem} onClick={() => handleAddToCart(item)}>Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
    )
}