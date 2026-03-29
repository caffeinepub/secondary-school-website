export const sampleNotices = [
  {
    id: 1n,
    title: "Annual Examination Schedule 2081 BS",
    body: "Examination schedule for all classes has been announced. Students are requested to check the detailed timetable on the notice board and prepare accordingly. Exams begin from Chaitra 1st.",
    date: BigInt(Date.now()) * 1_000_000n,
    isPublished: true,
  },
  {
    id: 2n,
    title: "Admission Open for 2081-82",
    body: "Admissions are now open for Grade 1 to Grade 12 for the academic year 2081-82. Contact the school office for application forms and details. Limited seats available.",
    date: BigInt(Date.now() - 3 * 86400000) * 1_000_000n,
    isPublished: true,
  },
  {
    id: 3n,
    title: "Sports Day Postponed",
    body: "The annual sports day originally scheduled for Falgun 15 has been postponed to Falgun 22 due to adverse weather conditions. All other activities remain on schedule.",
    date: BigInt(Date.now() - 7 * 86400000) * 1_000_000n,
    isPublished: true,
  },
];

export const sampleNews = [
  {
    id: 1n,
    title: "Science Exhibition 2081",
    body: "Students showcased innovative science projects at the annual science exhibition. Over 50 projects were displayed covering topics from renewable energy to robotics.",
    date: BigInt(Date.now() - 5 * 86400000) * 1_000_000n,
    isPublished: true,
    blobId: undefined,
  },
  {
    id: 2n,
    title: "Annual Prize Distribution Ceremony",
    body: "The school celebrated academic excellence with its annual prize distribution ceremony. Top performers from all grades were awarded certificates and scholarships.",
    date: BigInt(Date.now() - 10 * 86400000) * 1_000_000n,
    isPublished: true,
    blobId: undefined,
  },
  {
    id: 3n,
    title: "Yoga and Meditation Camp",
    body: "A 3-day yoga and meditation camp was organized for students to promote mental wellness and Buddhist values. Over 200 students participated enthusiastically.",
    date: BigInt(Date.now() - 14 * 86400000) * 1_000_000n,
    isPublished: true,
    blobId: undefined,
  },
];

export const sampleStaff = [
  {
    id: 1n,
    name: "Mr. Ram Prasad Sharma",
    designation: "Principal",
    bio: "M.Ed. in Education with 20+ years of teaching experience. Dedicated to holistic student development.",
    blobId: undefined,
  },
  {
    id: 2n,
    name: "Mrs. Sita Devi Poudel",
    designation: "Vice Principal",
    bio: "M.A. English Literature. Passionate about language education and student welfare.",
    blobId: undefined,
  },
  {
    id: 3n,
    name: "Mr. Bikash Thapa",
    designation: "Head of Science",
    bio: "M.Sc. Physics. Makes complex science concepts accessible and exciting for students.",
    blobId: undefined,
  },
  {
    id: 4n,
    name: "Mrs. Anita Gurung",
    designation: "English Teacher",
    bio: "B.Ed. English. Committed to building strong communication skills in every student.",
    blobId: undefined,
  },
  {
    id: 5n,
    name: "Mr. Suresh Adhikari",
    designation: "Mathematics Teacher",
    bio: "M.Sc. Mathematics. Focuses on analytical thinking and problem-solving skills.",
    blobId: undefined,
  },
];

export function formatDate(ts: bigint): string {
  try {
    const ms = Number(ts / 1_000_000n);
    return new Date(ms).toLocaleDateString("en-NP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "";
  }
}
