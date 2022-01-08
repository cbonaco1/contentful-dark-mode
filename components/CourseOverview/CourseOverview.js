import Link from "next/link";
import styles from "./CourseOverview.module.scss";

const Overview = ({ duration, skillLevel, firstLessonUrl }) => {
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
        <Link href={firstLessonUrl}>
          <a className={`button ${styles.cta}`}>Start course</a>
        </Link>
      </div>
    </div>
  )
}

export default Overview;
