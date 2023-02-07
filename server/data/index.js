const users = [
  {
    username: "admin",
    password: "1234",
    id: 0,
    rated_difficulties: [
      {
        subject_code: "TIT69",
        difficulty: 3,
      },
    ],
    rated_professors: [],
  },
];

const subjects = [
  {
    name: "Computer Networks",
    subject_code: "TIT69",
    description:
      "Computer networking refers to connected computing devices (such as laptops, desktops, servers, smartphones, and tablets) and an ever-expanding array of IoT devices (such as cameras, door locks, doorbells, refrigerators, audio/visual systems, thermostats, and various sensors) that communicate with one another. ",
    year: 3,
    credits: 4,
    gate: true,
    practical: false,
    difficulty: 3,
    ratings_count: 1,
    professors: ["TITKJ", "TITS"],
  },
  {
    name: "Compiler Design",
    subject_code: "TIT420",
    description:
      "A compiler translates the code written in one language to some other language without changing the meaning of the program. It is also expected that a compiler should make the target code efficient and optimized in terms of time and space.",
    year: 3,
    credits: 3,
    gate: true,
    practical: true,
    difficulty: 2,
    ratings_count: 1,
    professors: ["TITJD", "TITS"],
  },
];

const professors = [
  {
    name: "Mr. Kim Jong",
    code: "TITKJ",
    designation: "Professor",
    nicknames: ["Chomu"],
    subjects: ["TIT69", "TIT44"],
    ratings: {
      marks_rating: 3.5,
      attendance_rating: 5,
      personality: 4,
      teaching: 2.25,
      knowledge: 4,
      count: 2,
    },
  },
  {
    name: "Prof. Dr. Eng. Ionut Mihai",
    code: "TITS",
    designation: "Assistant Professor",
    nicknames: ["Bhendi"],
    subjects: ["TIT69", "TIT420"],
    ratings: {
      marks_rating: 4,
      attendance_rating: 4,
      personality: 4,
      teaching: 2,
      knowledge: 4,
      count: 2,
    },
  },
  {
    name: "Dr. John Doe",
    code: "TITJD",
    designation: "Assistant Professor",
    nicknames: [],
    subjects: ["TIT69", "TIT420"],
    ratings: {
      marks_rating: 4,
      attendance_rating: 4,
      personality: 4,
      teaching: 2,
      knowledge: 4,
      count: 2,
    },
  },
];

module.exports = { users, subjects, professors };
