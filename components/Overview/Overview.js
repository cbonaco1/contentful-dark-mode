import styles from "./Overview.module.scss";

const Overview = ({ duration, skillLevel}) => {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Overview</h3>
      <div className={styles.item}>
        <p>Duration: {duration}</p>
      </div>
      <div className={styles.item}>
        <p>Skill level: {skillLevel}</p>
      </div>
      <div className={styles.ctaWrapper}>
        <button className={styles.cta}>Start Course</button>
      </div>
    </div>
  )
}

export default Overview;
