import TableOfContents from "components/TableOfContents";

const Layout = ({ children, lessonLinks }) => {
  return (
    <div className="layout">
      <div className="side">
        <TableOfContents links={lessonLinks} />
      </div>
      <div className="content">
        {children}
      </div>
      <p>Footer could go here</p>
    </div>
  )
}

export default Layout;
