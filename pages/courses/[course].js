import { createClient } from 'contentful'
import { richTextFromMarkdown } from "@contentful/rich-text-from-markdown";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import Head from 'next/head'

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
})

const Course = ({ course }) => {
  const { title, description } = course;
  return (
    <div>
      <Head>
        <title>{title} | Courses</title>
      </Head>
      <h2>{title}</h2>
      <div>{documentToReactComponents(description)}</div>
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

  const singleCourse = course.items[0].fields;
  const description = await richTextFromMarkdown(singleCourse.description);

  return {
    props: {
      course: {
        description,
        title: singleCourse.title,
      }
    }
  }
}

export default Course;
