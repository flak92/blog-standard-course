import { Configuration, OpenAIApi } from "openai";

export default async function handler(req, res) {
  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(config);

  const { topic, keywords } = req.body;
  //const topic = "Fullstack-JS-Developer most used functions";
  //const keywords = "change from js to ts, best js stacks, next vs express";

  /*
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    temperature: 0,
    max_tokens: 3600,
    prompt: `Write for a Fullstack-JS-Developer an interesting SEO friendly Post about ${topic}:,
    that targets the following comma-separated keywords: ${keywords}, the content should be in SEO-friendly HTML.
    The response must also include appropriate HTML tittle and meta description content.
    The return format muust be a stringified JSON in the following format:
    {
        "postContent": post content here
        "title": post title here
        "metadescription": post description here
    }`,
  });
  */

  const postContentResponse = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0,
    messages: [
      {
        role: "system",
        content:
          "You are a Senior Fullstack JS Developer and you teach only best practices on your blog",
      },
      {
        role: "user",
        content: `generate a JS teaching best practice SEO friendly post about ${topic},
      that targets the following comma-separated keywords: ${keywords}. 
      Content should be formatted in SEO-friendly HTML,
      limited to the following HTML tags: p, h1, h2, h3, h4, h5, h6, strong, li, ol, ul, i.`,
      },
    ],
  });

  const postContent = postContentResponse.data.choices[0]?.message?.content || "";

  const titleResponse = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0,
    messages: [
      {
        role: "system",
        content:
          "You are a Senior Fullstack JS Developer and you teach only best practices on your blog",
      },
      {
        role: "user",
        content: `generate a JS teaching best practice SEO friendly post about ${topic},
      that targets the following comma-separated keywords: ${keywords}. 
      Content should be formatted in SEO-friendly HTML,
      limited to the following HTML tags: p, h1, h2, h3, h4, h5, h6, strong, li, ol, ul, i.`,
      }, {
        role: "assistant",
        content: postContent
      }, {
        role: "user",
        content: "Generate appropriate title tag text for the above post"
      }
    ],
  });

  const metaDescriptionResponse = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0,
    messages: [
      {
        role: "system",
        content:
          "You are a Senior Fullstack JS Developer and you teach only best practices on your blog",
      },
      {
        role: "user",
        content: `generate a JS teaching best practice SEO friendly post about ${topic},
      that targets the following comma-separated keywords: ${keywords}. 
      Content should be formatted in SEO-friendly HTML,
      limited to the following HTML tags: p, h1, h2, h3, h4, h5, h6, strong, li, ol, ul, i.`,
      }, {
        role: "assistant",
        content: postContent
      }, {
        role: "user",
        content: "Generate SEO-friendly meta description content for the above post"
      }
    ],
  });

  const title = titleResponse.data.choices[0]?.message?.content || "";
  const metaDescription = metaDescriptionResponse.data.choices[0]?.message?.content || "";

  console.log("Tu masz Post Content:", postContent);
  console.log("Tu masz Title:", title);
  console.log("Tu masz Metadata:", metaDescription);

  /*
  res
    .status(200)
    .json({
      post: JSON.parse(response.data.choices[0]?.text.split("\n").join("")),
    });
    */

res.status(200).json({
  post: {
    postContent,
    title,
    metaDescription,
  },
});


};
