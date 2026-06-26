import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("VITE_GEMINI_API_KEY is missing in your .env file.");
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
    temperature: 0.4,
  },
});

async function generateJSON(prompt) {
  try {
    const result = await model.generateContent(prompt);

    const text = result.response.text().trim();

    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Failed to generate AI response.");
  }
}

// =======================
// Analyze Task
// =======================

export async function analyzeTask(task) {
  const prompt = `
You are an expert productivity assistant.

Return ONLY valid JSON.

{
  "priorityScore": 1,
  "urgencyLevel": "Low",
  "estimatedMinutes": 60,
  "reasoning": "Reason"
}

Task

Name: ${task.name}
Deadline: ${task.deadline}
Description: ${task.description || "None"}
Priority: ${task.priority}
Today's Date: ${new Date().toDateString()}
`;

  return generateJSON(prompt);
}

// =======================
// Break Into Subtasks
// =======================

export async function breakIntoSubtasks(task) {
  const prompt = `
Break the following task into at most 5 actionable subtasks.

Return ONLY a JSON array.

[
 {
   "id":1,
   "title":"Subtask",
   "estimatedMinutes":30,
   "done":false
 }
]

Task Name:
${task.name}

Description:
${task.description || "None"}

Deadline:
${task.deadline}
`;

  return generateJSON(prompt);
}

// =======================
// Weekly Schedule
// =======================

export async function generateSchedule(tasks, hoursPerDay) {
  const prompt = `
Create a practical study/work schedule.

Return ONLY a JSON array.

[
 {
   "date":"2026-06-26",
   "day":"Today",
   "tasks":[
      {
        "taskName":"React",
        "action":"Complete Components",
        "minutes":90
      }
   ]
 }
]

Rules

- Maximum ${hoursPerDay} hours/day.
- Highest priority first.
- Nearest deadlines first.
- Split large tasks.
- Do not exceed available time.

Tasks

${tasks
  .map(
    (t) => `
Name: ${t.name}
Deadline: ${t.deadline}
Priority: ${t.priority}
Urgency: ${t.analysis?.urgencyLevel || "Unknown"}
Priority Score: ${t.analysis?.priorityScore || 0}
Estimated Minutes: ${t.analysis?.estimatedMinutes || 60}
`
  )
  .join("\n")}
`;

  return generateJSON(prompt);
}

// =======================
// Action Plan
// =======================

export async function generateActionPlan(task) {
  const prompt = `
Create a motivating action plan.

Return ONLY JSON.

{
  "urgentMessage":"...",
  "todayActions":[
      "...",
      "...",
      "..."
  ],
  "timeRequired":"...",
  "tip":"..."
}

Task

Name:
${task.name}

Deadline:
${task.deadline}

Description:
${task.description || "None"}

Urgency:
${task.analysis?.urgencyLevel || "Unknown"}

Priority Score:
${task.analysis?.priorityScore || 0}

Estimated Time:
${task.analysis?.estimatedMinutes || 60} minutes
`;

  return generateJSON(prompt);
}