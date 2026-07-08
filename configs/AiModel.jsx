import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export const GenerateCourseLayout_AI = {
  sendMessage: (prompt) =>
    model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [{ text: "Generate A Course Tutorial on Following Detail With field as Course Name, Description, Along with Chapter Name, about, Duration: Category: 'Programming', Topic: Python, Level:Basic, Duration:1 hours, NoOf Chapters:5 , in JSON format" }],
        },
        {
          role: "model",
          parts: [{ text: '{"course":{"name":"Introduction to Python Programming","description":"A beginner-friendly Python course.","chapters":[{"name":"Introduction to Python","about":"History and features of Python.","duration":"15 minutes"},{"name":"Basic Syntax","about":"Variables, data types, operators.","duration":"25 minutes"}],"category":"Programming","topic":"Python","level":"Basic","duration":"1 hour","numberOfChapters":5}}' }],
        },
      ],
    }).sendMessage(prompt),
};

export const GenerateChapterContent_AI = {
  sendMessage: (prompt) =>
    model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [{ text: "Explain the concept in Detail on Topic: Python Basic, Chapter:Variables and Data Types, in JSON Format with list of array with field as title, explanation on give chapter in detail, Code Example(Code field in <precode> format) if applicable" }],
        },
        {
          role: "model",
          parts: [{ text: '[{"title":"Introduction to Variables","explanation":"Variables store data in Python.","codeExample":"<precode>name = \\"Alice\\"\\nprint(name)</precode>"}]' }],
        },
      ],
    }).sendMessage(prompt),
};
