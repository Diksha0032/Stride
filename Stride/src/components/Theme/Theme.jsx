import styles from "./Theme.module.css"
import Image from "./darkmode.png"

export function Theme({onToggle}){
  return (
    <div className={styles.ThemeContainer}>
      <button 
      className={styles.ThemeImg}
      onClick={onToggle}
      ><img src={Image} alt="darkmode" /></button>
    </div>
  )
}