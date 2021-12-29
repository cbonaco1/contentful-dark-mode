import Link from "next/link";

const TableOfContents = ({links}) => {
  return (
    <div>
      <p>Table of Contents</p>
      <ul>
        {
          links.map((link) => {
            const { href, title, id } = link;
            return (
              <li key={id}>
                <Link href={href}>{title}</Link>
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}

export default TableOfContents;
