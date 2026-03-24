import background from '../../assets/background.png'
import styles from './home.module.css'
import { useNavigate } from 'react-router-dom'

export default function Home() {
    let navigate = useNavigate();
    return (
        <div className={styles.homePage}>
            <img src={background} alt='Shopping cart' className={styles.heroImage}/>
            <div className={styles.heroContent}>
                <h1 className={styles.title}>Shop Here</h1>
                <p className={styles.subtitle}>Find everything you need in one place.</p>
                <button className={styles.shopBtn} onClick={() => navigate("/shop")}>Shop Now</button>
            </div>
            <p className={styles.credit}>
                Photo from <a href='https://www.pymnts.com/innovation/2019/grocery-cameras-smart-shelves-retail-technology/'
                target='blank' rel="noreferrer">PYMNTS.com</a>
            </p>
        </div>
    )
}