import { Configuration, OpenAIApi } from "openai";

export default async function handler(req, res) {
  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(config);



  const {topic, keywords} = req.body;
  //const topic = "Fullstack-JS-Developer most used functions";
  //const keywords = "change from js to ts, best js stacks, next vs express";




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
  
  console.log("response:", response);

  res.status(200).json({ post: JSON.parse(response.data.choices[0]?.text.split("\n").join("")),
});
}
