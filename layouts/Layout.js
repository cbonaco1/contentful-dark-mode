import TableOfContents from "components/TableOfContents";
import styles from "./Layout.module.scss";

const Layout = ({ children, lessonLinks }) => {
  return (
    <div className={styles.layout}>
      <div className={styles.tocWrapper}>
        <TableOfContents links={lessonLinks} />
      </div>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  )
}

export default Layout;
