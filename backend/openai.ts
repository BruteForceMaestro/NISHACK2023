import OpenAI from "openai";
import dotenv from "dotenv"
import { ProfessionAspects } from "./models/professionAspects";
dotenv.config()

let openai : OpenAI;
if (process.env.OPENAI_API_KEY == undefined){
  console.log("OPENAI API KEY IS UNDEFINED WTF")
} else {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
}



export async function generateResponse(profession_aspects: ProfessionAspects) {
  /*
  Education and Qualifications: What is your educational background? What degrees or certifications do you hold?

  Skills and Strengths: What are your key skills? These could include technical skills, soft skills, and any specific talents you possess.

  Interests and Passions: What are you passionate about? What activities or subjects do you enjoy working on in your free time?

  Work Experience: What is your work experience? Have you worked in a specific industry or field? What were your responsibilities and achievements?

  Values and Motivations: What is important to you in a job? Are you motivated by helping others, financial success, creative expression, problem-solving, or something else?

  Preferred Work Environment: Do you prefer working independently or in a team? Do you enjoy a fast-paced environment or a more relaxed one?

  Career Goals: What are your long-term career goals? Are there specific industries or roles you aspire to be a part of?

  Geographic Preferences: Are you open to working in specific locations, or do you have preferences regarding the geographical area of your workplace?

  Lifestyle Considerations: Are there specific lifestyle factors that are important to you, such as work-life balance, travel opportunities, or flexibility in working hours?

  Challenges or Constraints: Are there any limitations or constraints that might affect your career choices? For example, health considerations, family commitments, or other personal factors.
    const professionAspects = {
    education: "",
    skills: "",
    interests: "",
    workExperience: "",
    values: "",
    env: "",
    goals: "",
    geo: "",
    lifestyle: "",
    challenges: ""
    }; */
    const system_msg = `
    You are helping a person choose a career path and get a job.
    I want you to answer me strictly the way I say.
    Choose one profession out of this list for following messages: 
    const bestProfessions = [
      'Software Developer',
      'Medical Doctor',
      'Data Scientist/Analyst',
      'Financial Analyst',
      'Marketing Manager',
      'Civil Engineer',
      'Cybersecurity Specialist',
      'Pharmacist',
      'Attorney',
      'Environmental Scientist',
      'Surgeon',
      'Human Resources Manager',
      'Mechanical Engineer',
      'Registered Nurse',
      'Phychiatrist',
      'Teacher/Educator',
      'Graphic Designer',
      'Director',
      'Actor',
      'Biomedical Researcher'
    ];
    You should follow this format: 
    Profession: [your chosen profession];
    Roadmap: [your roadmap in one paragraph, no newlines]
    `

    const user_msg = `
      Education and Qualifications: ${profession_aspects.education}
      Skills and Strengths: ${profession_aspects.skills}
      Interests and Passions: ${profession_aspects.interests}
      Work Experience: ${profession_aspects.workExperience}
      Values and Motivation: ${profession_aspects.values}
      Preferred Work Environment: ${profession_aspects.env}
      Career Goals: ${profession_aspects.goals}
      Geographic Preferences: ${profession_aspects.geo}
      Lifestyle Considerations: ${profession_aspects.lifestyle}
      Challenges or Constraints: ${profession_aspects.challenges}
    `
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: system_msg },
        //{role: "system", content: "hello world"}
        { role: "user", content: user_msg }
      ],
      model: "gpt-3.5-turbo"
    });

  console.log(completion.choices[0].message.content)
  return completion.choices[0].message.content
}