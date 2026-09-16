import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarDays, Clock3 } from "lucide-react";
import { notFound } from "next/navigation";
import { blogArticles, getBlogArticle } from "@/content/blog";

const siteUrl = "https://www.theblackdahlia.co.uk";

type BlogArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return blogArticles.map((article) => ({ slug: article.slug }));
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00Z`));
}

export async function generateMetadata({ params }: BlogArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getBlogArticle(slug);

  if (!article) return { title: "Article" };

  const imageUrl = `${siteUrl}${article.primaryImage}`;

  return {
    title: article.title,
    description: article.excerpt,
    keywords: article.keywords,
    authors: [{ name: article.author }],
    alternates: { canonical: `${siteUrl}/blog/${article.slug}` },
    openGraph: {
      type: "article",
      url: `${siteUrl}/blog/${article.slug}`,
      title: article.title,
      description: article.excerpt,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.author],
      section: article.category,
      images: [{ url: imageUrl, alt: article.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [imageUrl],
    },
  };
}

function jsonLdForArticle(article: (typeof blogArticles)[number]) {
  const articleUrl = `${siteUrl}/blog/${article.slug}`;
  const imageUrl = `${siteUrl}${article.primaryImage}`;

  return [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "@id": `${articleUrl}#article`,
      headline: article.title,
      description: article.excerpt,
      image: [imageUrl],
      datePublished: article.publishedAt,
      dateModified: article.updatedAt,
      author: {
        "@type": "Organization",
        name: article.author,
        url: siteUrl,
      },
      publisher: {
        "@type": "Organization",
        name: "The Black Dahlia",
        url: siteUrl,
        logo: { "@type": "ImageObject", url: `${siteUrl}/dahlialogo-dark.svg` },
      },
      mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
      keywords: article.keywords.join(", "),
      articleSection: article.category,
      inLanguage: "en-GB",
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "Journal", item: `${siteUrl}/blog` },
        { "@type": "ListItem", position: 3, name: article.title, item: articleUrl },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: article.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ];
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { slug } = await params;
  const article = getBlogArticle(slug);
  if (!article) notFound();

  const structuredData = jsonLdForArticle(article);

  return (
    <div className="pageStack pageStack--blogArticle">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <header className="blogArticleHero">
        <div className="container blogArticleHeroInner">
          <Link href="/blog" className="inlineAction">
            <ArrowLeft size={14} /> Back to the journal
          </Link>
          <div className="blogArticleMeta">
            <span>{article.category}</span>
            <span><CalendarDays size={13} /> {formatDate(article.publishedAt)}</span>
            <span><Clock3 size={13} /> {article.readingTime}</span>
          </div>
          <h1>{article.title}</h1>
          <p className="blogArticleDek">{article.dek}</p>
          <p className="blogArticleByline">By {article.author} · Updated {formatDate(article.updatedAt)}</p>
        </div>
      </header>

      <div className="container blogArticleLayout">
        <article className="blogArticleBody">
          <img
            className="blogArticleImage"
            src={article.primaryImage}
            alt="The Black Dahlia tattoo studio"
            width={1600}
            height={1067}
          />

          {article.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {section.bullets ? (
                <ul>
                  {section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                </ul>
              ) : null}
            </section>
          ))}

          <section className="blogArticleFaq" aria-labelledby="article-faq-heading">
            <h2 id="article-faq-heading">Frequently asked questions</h2>
            {article.faq.map((item) => (
              <details key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </section>
        </article>

        <aside className="blogArticleAside">
          <div className="blogArticleAsidePanel">
            <p className="eyebrow">Ready to start?</p>
            <h2>Choose the hand before you choose the date.</h2>
            <p>Browse the resident artists, find the closest portfolio match and send a proper brief.</p>
            <Link className="primaryButton" href="/artists">Meet the artists <ArrowRight size={15} /></Link>
          </div>
          <div className="blogArticleAsidePanel blogArticleAsidePanel--quiet">
            <p className="eyebrow">The Black Dahlia</p>
            <p>Private tattoo studio in Littleport near Ely, Cambridgeshire. By appointment only.</p>
            <Link className="inlineAction" href="/booking">Start a booking enquiry <ArrowRight size={14} /></Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
