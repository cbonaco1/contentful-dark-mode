import { createClient } from 'contentful'
import { richTextFromMarkdown } from "@contentful/rich-text-from-markdown";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { useRouter } from 'next/router'
import Link from 'next/link'
import Head from 'next/head'
import { Fragment } from "react";
import Layout from "layouts/Layout";
import styles from "./Lesson.module.scss";

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
})

const Lesson = ({ lesson, course, nextLessonUrl, sections }) => {
  const { query } = useRouter();
  const { lessons, slug, title:courseTitle } = course;
  const { title:lessonTitle, modules } = lesson;

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
    <Fragment>
      <Head>
        <title>{courseTitle} | {lessonTitle}</title>
      </Head>
      <Layout lessonLinks={lessonLinks}>
        <h1 className={styles.title}>{lessonTitle}</h1>
        <div className={styles.content}>
          {sections && sections.map((section) => {
            return documentToReactComponents(section)
          })}
        </div>
        {(nextLessonUrl && (
          <Link href={nextLessonUrl}>
            <a className="button">Go to the next lesson</a>
          </Link>
        ))}
      </Layout>
    </Fragment>
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

  const courseObj = course.items[0].fields
  const lessonObj = lesson.items[0].fields;

  const indexOfCourseLesson = courseObj.lessons.findIndex((lesson) => {
    return lesson.fields.slug === params.lesson;
  });

  let nextLessonUrl = null;
  if (indexOfCourseLesson < courseObj.lessons.length - 1) {
    const nextLesson = courseObj.lessons[indexOfCourseLesson + 1];
    nextLessonUrl = `/courses/${params.course}/lessons/${nextLesson.fields.slug}`;
  }

  const copySections = [];
  lessonObj.modules.forEach(async (module) => {
    if (module.sys.contentType.sys.id === 'lessonCopy') {
      copySections.push(module.fields.copy);
    }
  })

  const conversions = copySections.map(async (copy) => await richTextFromMarkdown(copy) );
  const sections = await Promise.all(conversions);

  return {
    props: {
      nextLessonUrl,
      sections,
      lesson: lessonObj,
      course: courseObj,
    }
  }
}
