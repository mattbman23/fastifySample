'use strict';

let currentId = 2;
const posts = [
  {
    id: 1,
    user: 'JohnDoe',
    comment: 'owls > cats',
  },
];

const postOptions = {
  schema: {
    body: {
      type: 'object',
      required: ['user', 'comment'],
      properties: {
        comment: { type: 'string' },
        user: { type: 'string' },
      },
    },
    response: {
      201: {
        type: 'object',
        properties: {
          comment: { type: 'string' },
          user: { type: 'string' },
        },
      },
    },
  },
};

/**
 *
 * @param {import('fastify').FastifyInstance} fastify
 */
module.exports = async function (fastify, opts) {
  const createError = fastify.httpErrors.createError;
  // READ
  fastify.get('/', async function (req, res) {
    res.status(200).send(posts);
  });

  // CREATE
  fastify.post('/', postOptions, async function (req, res) {
    const { comment, user } = req.body;

    const newPost = { id: currentId, comment, user };

    posts.push(newPost);

    currentId++;

    res.status(201).send(newPost);
  });

  // READ by ID
  fastify.get('/:id', async function (req, res) {
    try {
      const post = posts.find((p) => p.id === +req.params.id);

      if (!post) {
        // return fastify.httpErrors.notFound('Post not found');
        return createError(404, 'This post doesss not exist');
      }

      post.support = fastify.someSupport();
      return post;
    } catch (err) {
      throw new Error('Something went wrong');
    }
  });
};
