import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock3 } from "lucide-react";
import { blogArticles } from "@/content/blog";

const siteUrl = "https://www.theblackdahlia.co.uk";

export const metadata: Metadata = {
  title: "Tattoo Journal",
  description:
    "Practical tattoo guides from The Black Dahlia, covering artists, studio visits, booking, preparation and aftercare in Cambridgeshire.",
  alternates: { canonical: `${siteUrl}/blog` },
  openGraph: {
    title: "Tattoo Journal | The Black Dahlia",
    description:
      "Practical tattoo guides from The Black Dahlia in Cambridgeshire.",
    url: `${siteUrl}/blog`,
    type: "website",
  },
};

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00Z`));
}

export default function BlogPage() {
  const [featuredArticle, ...otherArticles] = blogArticles;

  return (
    <div className="pageStack pageStack--blog">
      <section className="pageHero">
        <div className="container">
          <div className="pageHeroDivider" />
          <p className="eyebrow">The journal</p>
          <h1 className="displayXL">
            Useful things <em>before you sit.</em>
          </h1>
          <p className="lede">
            Straight answers on choosing an artist, planning a piece and looking after it once
            you leave the room.
          </p>
        </div>
      </section>

      <section className="container blogIndexIntro">
        <p className="eyebrow">From the studio</p>
        <p>
          No filler, no trend reports. Just practical guidance for people considering a tattoo
          in Cambridge, Ely and the wider Cambridgeshire area.
        </p>
      </section>

      {featuredArticle ? (
        <section className="container blogFeaturedArticle">
          <div className="blogFeaturedImage">
            <img src={featuredArticle.primaryImage} alt="The Black Dahlia tattoo studio" />
          </div>
          <div className="blogFeaturedCopy">
            <div className="blogArticleMeta">
              <span>{featuredArticle.category}</span>
              <span><CalendarDays size={13} /> {formatDate(featuredArticle.publishedAt)}</span>
              <span><Clock3 size={13} /> {featuredArticle.readingTime}</span>
            </div>
            <h2>{featuredArticle.title}</h2>
            <p>{featuredArticle.excerpt}</p>
            <Link className="primaryButton" href={`/blog/${featuredArticle.slug}`}>
              Read the guide <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      ) : null}

      {otherArticles.length > 0 ? (
        <section className="container blogArticleGrid" aria-label="More articles">
          {otherArticles.map((article) => (
            <article key={article.slug} className="blogArticleCard">
              <img src={article.primaryImage} alt="" loading="lazy" />
              <div>
                <div className="blogArticleMeta">
                  <span>{article.category}</span>
                  <span>{article.readingTime}</span>
                </div>
                <h2><Link href={`/blog/${article.slug}`}>{article.title}</Link></h2>
                <p>{article.excerpt}</p>
              </div>
            </article>
          ))}
        </section>
      ) : null}
    </div>
  );
}
