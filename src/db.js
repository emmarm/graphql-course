const users = [
  {
    id: "3662",
    name: "Emma",
    email: "emma@example.com",
    age: 29
  },
  {
    id: "33272",
    name: "Debra",
    email: "debra@example.com"
  },
  {
    id: "3742",
    name: "Eric",
    email: "eric@example.com"
  }
];

const posts = [
  {
    id: "1",
    title: "First Post",
    body: "This is the first post",
    published: true,
    author: "3662"
  },
  {
    id: "2",
    title: "Second Post",
    body: "This is the second post",
    published: true,
    author: "3662"
  },
  {
    id: "3",
    title: "Coming Soon",
    body: "This will be amazing",
    published: false,
    author: "33272"
  }
];

const comments = [
  {
    id: "111",
    text: "Great post!",
    author: "33272",
    post: "1"
  },
  {
    id: "222",
    text: "Check out this related post",
    author: "3742",
    post: "1"
  },
  {
    id: "333",
    text: "Cool, thanks for sharing!",
    author: "33272",
    post: "2"
  },
  {
    id: "444",
    text: "Love it!",
    author: "3742",
    post: "2"
  }
];

export default {
  users,
  posts,
  comments
};
