import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { Configuration, OpenAIApi } from 'openai';
import clientPromise from '../../lib/mongodb';

export default withApiAuthRequired(async function handler(req, res) {
  const { user } = await getSession(req, res);
  const client = await clientPromise;
  const db = client.db('BlogStandard');
  const userProfile = await db.collection('users').findOne({
    auth0Id: user.sub,
  });

  if (!userProfile?.availableTokens) {
    res.status(403);
    return;
  }

  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(config);

  const { topic, keywords } = req.body;

  if (!topic || !keywords) {
    res.status(422);
    return;
  }

  if (topic.length > 80 || keywords.length > 80) {
    res.status(422);
    return;
  }





  ////////////////////////////////////////////////POST CONTENT//////////////////////////////////////////////////////////////////
  const postContentResult = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are a Senior Fullstack Javascript Developer with experience in production of Successfull Commercial Projects that shares best practices and know how as code examples to his Junior Developer Students',
      },
      {
        role: 'user',
        content: `generate Javascript teaching best practices structured post using tables, lists and other best teaching practises like visualisation of data.
        The post should be about ${topic},
        that targets the following comma-separated keywords: ${keywords}. 
        Content should be formatted in structured HTML,
        limited to the following HTML tags: p, h1, h2, h3, strong, li, ol, ul, i,
        tables and everything that's necessary for effective teaching.
        Begin with a h1 or h2`,
      },
    ],
    temperature: 0,
  });
  const postContent = postContentResult.data.choices[0]?.message.content;


////////////////////////////////////////////////Title Result//////////////////////////////////////////////////////////////////

  const titleResult = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are a Senior Fullstack Javascript Developer with experience in production of Commercial Projects that shares best practices and know how as code examples to his Junior Developer Students',
      },
      {
        role: 'user',
        content: `generate Javascript teaching best practices structured post using tables, lists and other best teaching practises like visualisation of data.
        The post should be about ${topic},
        that targets the following comma-separated keywords: ${keywords}. 
        Content should be formatted in structured HTML,
        limited to the following HTML tags: p, h1, h2, h3, strong, li, ol, ul, i,
        tables and everything that's necessary for most effective teaching.
        Begin with a h1 or h2`,
      },
      {
        role: 'assistant',
        content: postContent,
      },
      {
        role: 'user',
        content: 'Generate appropriate title tag text for the above blog post',
      },
    ],
    temperature: 0,
  });
  const title = titleResult.data.choices[0]?.message.content;

  //////////////////////////////////////////////// META DESCRIPTION /////////////////////////////////////////////////////////////////

  const metaDescriptionResult = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are a Senior Fullstack Javascript Developer with experience in production of Commercial Projects that shares best practices and know how as code examples to his Junior Developer Students',
      },
      {
        role: 'user',
        content: `generate Javascript teaching best practices structured post using tables, lists and other best teaching practises like visualisation of data.
            The post should be about ${topic},
        that targets the following comma-separated keywords: ${keywords}.
        Content should be formatted in structured HTML,
        limited to the following HTML tags: p, h1, h2, h3, strong, li, ol, ul, i,
      tables and everything that's necessary for most effective teaching.
  Begin with a h1 or h2`,
      },
      {
        role: 'assistant',
        content: postContent,
      },
      {
        role: 'user',
        content:
          'Generate meta description with tools, technologies and framework suggestions to above posts',
      },
    ],
    temperature: 0,
  });
  const metaDescription = metaDescriptionResult.data.choices[0]?.message.content;

  console.log('POST CONTENT: ', postContent);
  console.log('TITLE: ', title);
  console.log('META DESCRIPTION: ', metaDescription);

  await db.collection('users').updateOne(
  {
    auth0Id: user.sub,
  },
  {
    $inc: {
      availableTokens: -1,
    },
  }
);

  const post = await db.collection('posts').insertOne({
    postContent: postContent || '',
    title: title || '',
    metaDescription: metaDescription || '',
    topic,
    keywords,
    userId: userProfile._id,
    created: new Date(),
  });

console.log('POST: ', post);




  res.status(200).json({
    postId: post.insertedId,
  });
});
