import { createClient } from 'contentful'

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
})

const Course = ({ course }) => {
  return (
    <div>
      <h2>{course.fields.title}</h2>
      <p>{course.fields.description}</p>
    </div>
  )
}

export async function getStaticPaths() {
  const courses = await client.getEntries({
    content_type: 'course',
  });

  const paths = courses.items.map(item => {
    return {
      params: {
        course: item.fields.slug
      }
    }
  });

  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps(context) {
  const { params } = context;

  const course = await client.getEntries({
    content_type: 'course',
    'fields.slug': params.course,
    limit: 1,
  })

  return {
    props: {
      course: course.items[0]
    }
  }
}

export default Course;
