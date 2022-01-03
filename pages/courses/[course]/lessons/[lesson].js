import { createClient } from 'contentful'
import { useRouter } from 'next/router'
import Layout from "layouts/Layout";

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
})

const Lesson = ({ lesson, course }) => {
  const { query } = useRouter();
  const { lessons, slug } = course;
  const lessonLinks = lessons.map((lesson) => {
    return {
      href: `/courses/${query.course}/lessons/${lesson.fields.slug}`,
      title: lesson.fields.title,
      id: lesson.sys.id
    }
  })

  lessonLinks.unshift({
    href: `/courses/${query.course}`,
    title: 'Course overview',
    id: slug,
  })

  return (
    <Layout lessonLinks={lessonLinks}>
      <h2>{lesson.title}</h2>
    </Layout>
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
      lesson: lesson.items[0].fields,
      course: course.items[0].fields,
    }
  }
}
