import { useState } from 'react';
import styles from './cart.module.css'
import { useOutletContext } from 'react-router-dom'

export default function Cart() {
    const { itemsInCart, setItemsInCart } = useOutletContext();

    function handleUpdateQuantity(id, newQty) {
        setItemsInCart((prev) =>
            prev.map((item) => 
                item.id === id ? { 
                    ...item, 
                    quantity: newQty 
                } : item)
        );
    }

    function handleRemoveItem(id) {
        setItemsInCart((prev) => prev.filter((item) => 
            item.id !== id));
    }

    const total = itemsInCart.reduce((sum, item) => 
        sum + item.quantity * item.price, 0);

    return (
        <div className={styles.cart}>
        <h1>Items on the Cart</h1>
        {itemsInCart.map((item) => (
                <div className={styles.item} key={item.id}>
                    <div className={styles.itemInfo}>
                    <img className={styles.imagePlaceholder} src={item.image}/>
                    <p>{item.title}</p>
                    </div>
                    <div className={styles.quantity}>
                        <button className={styles.decrement} onClick={() => handleUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}>-</button>
                        <input
                         type="number"  
                         min={1} 
                         className={styles.qtyInput}
                         value={item.quantity}
                         onChange={(e) => handleUpdateQuantity(item.id, Math.max(1, Number(e.target.value)))}
                          />
                        <button className={styles.increment} onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <p className={styles.price}>${item.price}</p>
                    <button className={styles.removeBtn} onClick={() => handleRemoveItem(item.id)}>Delete</button>
                </div>
        ))}
        <p className={styles.total}>Total: ${total}</p>
        </div>
    )
}