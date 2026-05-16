export type ArtistSlug = "sharnia" | "laura" | "caitlin";

export const studioInfo = {
  name: "The Black Dahlia",
  strapline: "Private Tattoo Studio",
  city: "Littleport near Ely",
  founded: 2019,
  addressLines: ["17 Granby Street", "Littleport", "Cambridgeshire", "CB6 1NE", "UK"],
  email: "theblackdahliastudio@gmail.com",
  mapUrl:
    "https://www.google.com/maps/place/The+Black+Dahlia/@52.4572734,0.3051077,17z/data=!3m1!4b1!4m6!3m5!1s0x47d817848426b8e5:0x1ac31c108fae03c6!8m2!3d52.4572734!4d0.3076826!16s%2Fg%2F11hych6zf4",
  social: {
    instagram: "https://www.instagram.com/theblackdahliastudio/",
    facebook: "https://www.facebook.com/theblackdahliastudio/?locale=en_GB",
  },
  primaryBookingUrl: "/booking",
  legacyBookingUrl: "https://www.theblackdahlia.co.uk/tattoo-booking-form",
};

export const services = [
  "Custom tattoo design",
  "Blackwork and black and grey realism",
  "Traditional and neo-traditional",
  "Illustrative and floral pieces",
  "Cover-ups and touch-ups",
  "In-person or virtual consultations",
];

export const homeIntro = {
  headline: "Appointment-only tattooing built around your idea.",
  subhead:
    "The Black Dahlia is a private studio in Littleport where every design is hand-drawn and every session is shaped around comfort, collaboration, and craft.",
  ctaPrimary: {
    label: "Request A Booking",
    href: "/booking",
  },
  ctaSecondary: {
    label: "Explore Artists",
    href: "/artists",
  },
};

export const aboutCopy = {
  title: "About The Studio",
  paragraphs: [
    "At The Black Dahlia, we love creating unique designs with you and turning them into the perfect tattoo. We are passionate about our craft and enjoy working from a brief to bring your vision to life.",
    "Our studio is designed to feel welcoming and calm for people from all walks of life. We offer custom commissions and pre-drawn pieces, then adapt every design to suit your style and placement.",
    "Located in Littleport, we specialize across blackwork, realism B&G, traditional, color, and illustrative styles. We follow strict hygiene and aftercare practices to keep your experience safe and comfortable.",
  ],
  story: [
    "The studio opened in 2019 by co-owners Laura and Sharnia after years of working together in the industry.",
    "Their goal was to build a creative appointment-only space that feels like an escape for artists and clients alike.",
    "The team now includes three artists, each with a distinct style and active portfolio across social channels.",
  ],
};

export const artists = [
  {
    slug: "sharnia" as ArtistSlug,
    name: "Sharnia",
    role: "Co-owner / Tattoo Artist",
    specialities: ["Black and grey realism", "Blackwork", "Illustrative realism"],
    shortBio:
      "Experienced co-owner artist focused on black and grey realism and blackwork with custom and pre-drawn concepts.",
    longBio:
      "Sharnia is one of the co-owners at The Black Dahlia and an experienced tattoo artist specializing in black and grey realism and blackwork. She creates realistic and illustrative work, and collaborates closely on custom commissions.",
    social: {
      instagram: "https://www.instagram.com/sharnia.tattoos/",
      facebook: "https://www.facebook.com/Sharnia.tattoos/",
      tiktok: "https://www.tiktok.com/@sharniatattoos",
    },
  },
  {
    slug: "laura" as ArtistSlug,
    name: "Laura",
    role: "Co-owner / Tattoo Artist",
    specialities: ["Illustrative", "Geometric", "Dotwork", "Pattern work"],
    shortBio:
      "Co-owner artist with over a decade of tattooing, known for intricate geometric and illustrative dotwork pieces.",
    longBio:
      "Laura is one of the co-owners and has been tattooing since 2013. She is known for illustrative, geometric, and dotwork-heavy pieces, often weaving animals and character concepts into intricate custom designs.",
    social: {
      instagram: "https://www.instagram.com/wellertattoos/",
      facebook: "https://www.facebook.com/wellertattoos",
    },
  },
  {
    slug: "caitlin" as ArtistSlug,
    name: "Caitlin",
    role: "Tattoo Artist",
    specialities: ["Traditional blackwork", "Patchwork", "Bold linework"],
    shortBio:
      "Resident artist progressing from apprenticeship into bold traditional blackwork and patchwork-led tattooing.",
    longBio:
      "Caitlin joined The Black Dahlia in 2022 and quickly developed into a resident artist known for traditional blackwork, heavy line confidence, and strong patchwork compositions.",
    social: {
      instagram: "https://www.instagram.com/caitlin.tattoos/",
      facebook: "https://www.facebook.com/profile.php?id=100091572484700",
      tiktok: "https://www.tiktok.com/@caitl.ntattoos",
    },
  },
];

export const faqSections = [
  {
    title: "Bookings & Appointments",
    items: [
      {
        question: "How do I book an appointment?",
        answer: "Use our booking page or message us on social. For custom projects, include size, placement, and references.",
      },
      {
        question: "Do you take walk-ins?",
        answer: "Walk-ins are generally not accepted unless specifically advertised or arranged in advance.",
      },
      {
        question: "Do you require a deposit?",
        answer: "Yes. Deposits are non-refundable and secure your appointment slot while covering design preparation.",
      },
      {
        question: "How far in advance should I book?",
        answer: "Large custom work can book 3-8 weeks ahead. Smaller pieces are usually available in 1-2 weeks.",
      },
    ],
  },
  {
    title: "Consultation, Design & Pricing",
    items: [
      {
        question: "Can artists design from my idea or reference image?",
        answer: "Yes. Every artist can build custom work from a concept brief and adapt references for your final tattoo.",
      },
      {
        question: "How is pricing determined?",
        answer: "Pricing depends on size, detail, placement, and required time. Complex pieces are quoted after consultation.",
      },
      {
        question: "How do payments work?",
        answer: "Payments are arranged directly with your artist, typically via Monzo or cash.",
      },
    ],
  },
  {
    title: "Preparation, Safety & Healing",
    items: [
      {
        question: "How should I prepare?",
        answer: "Sleep well, eat beforehand, stay hydrated, avoid alcohol, and wear clothing that allows easy access to the tattoo area.",
      },
      {
        question: "What is the minimum age?",
        answer: "You must be 18+ with valid government ID.",
      },
      {
        question: "What is healing like?",
        answer: "Initial healing is around 2 weeks, while full healing can take 4-8 weeks depending on placement and size.",
      },
      {
        question: "Do you offer cover-ups and touch-ups?",
        answer: "Yes. Cover-ups are assessed by consultation and touch-up windows are available based on studio policy.",
      },
    ],
  },
];

export const policySections = [
  {
    title: "Deposits and Rescheduling",
    bullets: [
      "Deposits are non-refundable and hold your appointment date.",
      "With at least 7 days notice, deposits can be transferred once to a rescheduled appointment.",
      "Late cancellations or no-shows can forfeit deposits and affect future bookings.",
    ],
  },
  {
    title: "Studio Terms",
    bullets: [
      "All services are completed by trained professionals under strict hygiene standards.",
      "Results vary by skin type, placement, and aftercare compliance.",
      "Clients must disclose relevant medical conditions, allergies, or sensitivities before tattooing.",
      "Follow aftercare guidance to support best healing results.",
    ],
  },
  {
    title: "General Rules",
    bullets: [
      "Tattooing is 18+ only with valid photo ID.",
      "One support guest is usually allowed if space permits.",
      "Only documented service animals are permitted in the studio.",
    ],
  },
];

export const bookingArtists = artists.map((artist) => artist.name);
