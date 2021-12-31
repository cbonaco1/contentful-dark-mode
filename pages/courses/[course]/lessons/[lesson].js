import { createClient } from 'contentful'

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
})

const Lesson = ({ lesson, course }) => {
  return (
    <p>This is a lesson</p>
  )
}

export default Lesson;

export async function getStaticPaths() {
  const courses = await client.getEntries({
    content_type: 'course',
  });

  const paths = [];
  courses.items.forEach(course => {
    const courseSlug = course.fields.slug;
    course.fields.lessons.forEach((lesson) => {
      paths.push({
        params: {
          course: courseSlug,
          lesson: lesson.fields.slug
        }
      })
    })
  })

  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps(context) {
  const { params } = context;

  const lesson = await client.getEntries({
    content_type: 'lesson',
    'fields.slug': params.lesson,
    limit: 1,
  })

  const course = await client.getEntries({
    content_type: 'course',
    'fields.slug': params.course,
    limit: 1,
  })

  return {
    props: {
      lesson,
      course: course.items[0].fields,
    }
  }
}
