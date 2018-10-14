import { Prisma } from "prisma-binding";

const prisma = new Prisma({
  typeDefs: "src/generated/prisma.graphql",
  endpoint: "http://localhost:4466",
  secret: "whoasosecret"
});

export default prisma;

// prisma.query
//   .users(null, "{ id name email posts { title body } }")
//   .then(data => console.log(JSON.stringify(data, undefined, 2)));

// prisma.query
//   .comments(null, "{ id text author { id name }}")
//   .then(data => console.log(JSON.stringify(data, undefined, 2)));

// const createPostForUser = async (authorId, data) => {
//   const userExists = await prisma.exists.User({ id: authorId });

//   if (!userExists) {
//     throw new Error("User not found");
//   }

//   const post = await prisma.mutation.createPost(
//     {
//       data: {
//         ...data,
//         author: {
//           connect: {
//             id: authorId
//           }
//         }
//       }
//     },
//     "{ author { id name email posts { id title published } } }"
//   );

//   return post.author;
// };

// createPostForUser("cjn5neqjs000z0815nr7ym3lc", {
//   title: "Newly Created",
//   body: "Just as good as any prior.",
//   published: true
// })
//   .then(user => console.log(JSON.stringify(user, undefined, 2)))
//   .catch(err => console.log(err.message));

// const updatePostForUser = async (postId, data) => {
//   const postExists = await prisma.exists.Post({ id: postId });

//   if (!postExists) {
//     throw new Error("Post not found");
//   }

//   const post = await prisma.mutation.updatePost(
//     {
//       where: {
//         id: postId
//       },
//       data
//     },
//     "{ author { id name email posts { id title published } } }"
//   );

//   return post.author;
// };

// updatePostForUser("cjn70kjn800090915k0g4adxv", {
//   body: "Actually, even better than before!"
// })
//   .then(user => console.log(JSON.stringify(user, undefined, 2)))
//   .catch(err => console.log(err.message));
