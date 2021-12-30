import Link from "next/link";
import styles from "./TableOfContents.module.scss";

const TableOfContents = ({links}) => {
  return (
    <div className={styles.container}>
      <p className={styles.header}>Table of Contents</p>
      <div className={styles.content}>
        <ul>
          {
            links.map((link, index) => {
              const { href, title, id } = link;
              return (
                <li className={`${index === 0 ? styles.active : ''} ${styles.listItem}`} key={id}>
                  <Link href={href}>{title}</Link>
                </li>
              )
            })
          }
        </ul>
      </div>
    </div>
  )
}

export default TableOfContents;
