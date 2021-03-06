import { Fragment } from "react";
import { createClient } from 'contentful'
import { richTextFromMarkdown } from "@contentful/rich-text-from-markdown";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import Head from 'next/head'
import { useRouter } from 'next/router'
import Overview from "components/CourseOverview";
import Layout from "layouts/Layout";

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
})

const Course = ({ course }) => {
  const { asPath } = useRouter();
  const { title, description, lessons, slug, duration, skillLevel } = course;
  const lessonLinks = lessons.map((lesson) => {
    return {
      href: `${asPath}/lessons/${lesson.fields.slug}`,
      title: lesson.fields.title,
      id: lesson.sys.id
    }
  })

  lessonLinks.unshift({
    href: `${asPath}`,
    title: 'Course overview',
    id: slug,
  })
  
  return (
    <Fragment>
      <Head>
        <title>{title} | Courses</title>
      </Head>
      <Layout lessonLinks={lessonLinks}>
        <h1>{title}</h1>
        <Overview duration={duration} skillLevel={skillLevel} firstLessonUrl={lessonLinks[1].href} />
        <div>{documentToReactComponents(description)}</div>
      </Layout>
    </Fragment>
  )
}

export async function getStaticPaths() {
  const courses = await client.getEntries({
    content_type: 'course',
  });

  const paths = courses.items.map(course => {
    return {
      params: {
        course: course.fields.slug
      }
    };
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
        ...singleCourse,
        description,
      }
    }
  }
}

export default Course;
