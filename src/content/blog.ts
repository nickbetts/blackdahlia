export type BlogSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type BlogFaq = {
  question: string;
  answer: string;
};

export type BlogArticle = {
  slug: string;
  title: string;
  excerpt: string;
  dek: string;
  category: string;
  publishedAt: string;
  updatedAt: string;
  readingTime: string;
  author: string;
  primaryImage: string;
  keywords: string[];
  sections: BlogSection[];
  faq: BlogFaq[];
};

export const blogArticles: BlogArticle[] = [
  {
    slug: "best-tattoo-studios-in-cambridge",
    title: "Best Tattoo Studios in Cambridge: How to Choose the Right One for Your Tattoo",
    excerpt:
      "Looking for the best tattoo studio in Cambridge? Here is what to compare before you book, from artist portfolios and hygiene to consultations, location and aftercare.",
    dek:
      "The best tattoo studio is the one whose artists already understand the kind of work you want, in a room where you feel looked after from the first message to the final aftercare check.",
    category: "Studio guide",
    publishedAt: "2026-09-16",
    updatedAt: "2026-09-16",
    readingTime: "7 min read",
    author: "The Black Dahlia",
    primaryImage: "/media/crawl/images/the-tattoo-studio-ec25997a39.jpg",
    keywords: [
      "best tattoo studios Cambridge",
      "tattoo studio Cambridge",
      "tattoo artists near Cambridge",
      "tattoo studio near Ely",
      "how to choose a tattoo artist",
    ],
    sections: [
      {
        heading: "What makes a tattoo studio one of the best?",
        paragraphs: [
          "There is no single list that can decide the best tattoo studio for everyone. A fine-line specialist, a blackwork collector and someone planning a large realism piece may all need different artists, pacing and studio environments.",
          "A better way to compare studios is to look for a strong match between your brief and the artist's actual portfolio. The right studio should make that match easy to see, explain how consultations work, and give you clear information about deposits, preparation, hygiene and aftercare before you pay.",
        ],
        bullets: [
          "A portfolio with healed and recent work in the style you want",
          "Clear artist specialisms rather than one generic studio portfolio",
          "A consultation process that covers size, placement, references and expectations",
          "Straight answers about deposits, rescheduling, hygiene and aftercare",
          "A calm, professional room where you can sit comfortably for the full session",
        ],
      },
      {
        heading: "Start with the artist, not just the studio name",
        paragraphs: [
          "Tattooing is personal work. The studio matters, but the artist's line, composition, pacing and experience will shape the result more than a polished homepage will.",
          "Spend time on individual artist portfolios. Look for repeated evidence of the kind of tattoo you are planning: similar scale, placement, contrast, colour handling and level of detail. One impressive photograph is not enough to judge consistency.",
        ],
      },
      {
        heading: "Check the portfolio for the work you actually want",
        paragraphs: [
          "If you want black and grey realism, compare black and grey realism. If you want bold traditional blackwork, look for healed examples and close-ups of line weight and saturation. A studio can be excellent while still not being the right fit for every style.",
          "Also check whether the images are current. Active artists should have a portfolio that reflects what they are tattooing now, not only older work or images from a different artist who no longer works there.",
        ],
      },
      {
        heading: "Ask the practical questions before booking",
        paragraphs: [
          "The booking process should feel clear rather than mysterious. Before you commit, ask who will tattoo you, how the design is prepared, how much notice is needed to reschedule, and what happens if the artist decides a concept needs changing.",
          "For a custom piece, send the information that lets an artist assess the idea properly: your preferred artist, approximate size, placement, references, budget range and any relevant medical or skin information.",
        ],
      },
      {
        heading: "Cambridge, Ely and the wider area",
        paragraphs: [
          "If you are searching for a tattoo studio in Cambridge, it is worth widening the map slightly. The strongest match for your style may be in a nearby town rather than in the city centre, especially if you are planning a longer custom session and want a particular artist.",
          "The Black Dahlia is a private appointment-only tattoo studio in Littleport, near Ely, serving clients from Cambridgeshire and the surrounding area. The studio has three resident artists, each with a distinct portfolio, and focuses on custom work and flash by appointment.",
        ],
      },
      {
        heading: "Why clients choose The Black Dahlia",
        paragraphs: [
          "The Black Dahlia is built around a small room, direct contact with your artist and enough time to do the work properly. Sharnia focuses on black and grey realism and blackwork; Laura works across illustrative, geometric and dotwork-led pieces; Caitlin brings bold traditional blackwork and patchwork energy.",
          "That does not make the studio the right answer for every tattoo. It does mean you can compare three real artist portfolios, choose the strongest fit, and start a conversation with the person who may actually tattoo you.",
        ],
        bullets: [
          "Private, appointment-only sessions",
          "Custom designs and flash pieces",
          "Three resident artists with distinct styles",
          "Consultation-led booking for larger or more detailed work",
          "Clear preparation and aftercare guidance",
        ],
      },
      {
        heading: "A simple checklist before you send an enquiry",
        paragraphs: [
          "The best first message is specific enough to get a useful answer. You do not need a perfect design brief, but you should give the artist enough context to say whether the idea is a good fit.",
        ],
        bullets: [
          "What do you want tattooed, and why does it matter to you?",
          "Where will it go, and roughly how large should it be?",
          "Which artist or portfolio made you get in touch?",
          "What references show the mood, subject or line quality you like?",
          "Do you have a target date or budget range?",
          "Is there anything about your skin, health or previous tattoos the artist should know?",
        ],
      },
    ],
    faq: [
      {
        question: "What is the best tattoo studio in Cambridge?",
        answer:
          "The best studio depends on your tattoo style, artist fit, location and the quality of the consultation. Compare individual artist portfolios, recent work, hygiene information, booking terms and aftercare before choosing.",
      },
      {
        question: "Is The Black Dahlia in Cambridge?",
        answer:
          "The Black Dahlia is in Littleport, near Ely in Cambridgeshire, and welcomes clients from Cambridge and the surrounding area. It is a private, appointment-only tattoo studio.",
      },
      {
        question: "How do I choose the right tattoo artist?",
        answer:
          "Choose an artist whose recent portfolio repeatedly shows the style, scale and level of detail you want. Then contact them with your placement, approximate size, references and any deadline or budget information.",
      },
      {
        question: "What should I include in a tattoo enquiry?",
        answer:
          "Include your idea, placement, approximate size, preferred artist, reference images or links, timing, budget range and any relevant information about existing tattoos or your skin.",
      },
    ],
  },
];

export function getBlogArticle(slug: string): BlogArticle | undefined {
  return blogArticles.find((article) => article.slug === slug);
}
