import OpenAI from "openai";

const openai = new OpenAI({
    apikey: process.env.OPENAI_API_KEY,
});

async function main() {
    const content = `
    pick one profession out of this list {"software engineer", "cashier", "civil engineer"}
    for this biography: 
    "i would love to build bridges"
    construct roadmap for achieving a well paid job in this profession
    `

    const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: content }],
    model: "gpt-3.5-turbo",
  });

  console.log(completion.choices[0]['message']['content']);
}

main();