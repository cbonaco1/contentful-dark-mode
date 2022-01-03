import Link from "next/link";
import { useRouter } from 'next/router'
import styles from "./TableOfContents.module.scss";

const TableOfContents = ({links}) => {
  const { asPath } = useRouter();
  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Table of Contents</h2>
      <div className={styles.content}>
        <ul>
          {
            links.map((link) => {
              const { href, title, id } = link;
              return (
                <li className={`${asPath === href ? styles.active : ''} ${styles.listItem}`} key={id}>
                  <Link href={href}>
                    <a>{title}</a>
                  </Link>
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
