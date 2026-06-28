const OpenAI = require('openai');

// Initialize Groq (uses OpenAI-compatible API, completely free!)
let client = null;
if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your-groq-api-key-here') {
  client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
  });
}

const MODEL = 'openai/gpt-oss-120b';

// Generate interview questions based on resume and role
const generateQuestions = async (resumeText, role) => {
  if (!client) {
    return [
      `Tell me about yourself and your experience relevant to the ${role} role?`,
      'How do you approach solving a complex technical problem?',
      'Describe a challenging project you worked on and the outcome.',
      'How do you handle tight deadlines and competing priorities?',
      'What is your approach to learning new technologies?',
    ];
  }

  try {
    const response = await client.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are an expert interviewer. Generate interview questions based on the candidate resume and target role.',
        },
        {
          role: 'user',
          content: `Resume: ${resumeText || 'No resume provided'}\n\nTarget Role: ${role}\n\nGenerate exactly 5 interview questions. Return ONLY the questions, one per line, numbered 1-5.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });
    const text = response.choices[0].message.content;
    return text.split('\n').filter(q => q.trim().length > 0).map(q => q.replace(/^\d+[\.\)]\s*/, '')).slice(0, 5);
  } catch (error) {
    console.error('Groq Error:', error.message);
    return ['Tell me about yourself and your relevant experience?'];
  }
};

// Evaluate an answer
const evaluateAnswer = async (question, answer) => {
  if (!client) {
    return {
      score: 7.5,
      feedback: 'Good answer! Consider adding more specific examples from your experience to make your answer stronger. Also, try to mention the impact of your work.',
      tags: [
        { name: 'Clarity', rating: 'Good' },
        { name: 'Examples', rating: 'Needs Improvement' },
        { name: 'Technical Knowledge', rating: 'Good' },
      ],
    };
  }

  try {
    const response = await client.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are an interview evaluator. Evaluate the answer and return a JSON object with this exact format: {"score": <number 1-10>, "feedback": "<detailed feedback>", "tags": [{"name": "<criteria>", "rating": "<Good/Needs Improvement/Excellent>"}]}. Return ONLY the JSON, no other text.',
        },
        {
          role: 'user',
          content: `Question: ${question}\nAnswer: ${answer}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 500,
    });
    const text = response.choices[0].message.content;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return { score: 5, feedback: 'Could not parse evaluation.', tags: [] };
  } catch (error) {
    console.error('Groq Error:', error.message);
    return { score: 5, feedback: 'Could not evaluate answer.', tags: [] };
  }
};

// Generate a coding problem using AI
const generateCodingProblem = async (role, difficulty) => {
  if (!client) {
    return {
      id: 1,
      title: 'Two Sum',
      difficulty: 'Easy',
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
      examples: [
        { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
        { input: 'nums = [3,2,4], target = 6', output: '[1,2]', explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].' },
      ],
      constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', 'Only one valid answer exists.'],
      starterCode: 'function twoSum(nums, target) {\n  // Write your code here\n  \n}',
    };
  }

  try {
    const response = await client.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are a coding interview problem generator. Generate a coding problem and return it as a JSON object.',
        },
        {
          role: 'user',
          content: `Generate a ${difficulty || 'Easy'} coding interview problem for a ${role || 'Software Engineer'} role.

Return ONLY a JSON object with this exact format:
{
  "title": "<problem title>",
  "difficulty": "<Easy/Medium/Hard>",
  "description": "<problem description>",
  "examples": [{"input": "<input>", "output": "<output>", "explanation": "<explanation>"}],
  "constraints": ["<constraint1>", "<constraint2>"],
  "starterCode": "<JavaScript starter code with function signature and comment>"
}

Return ONLY the JSON, no other text.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 800,
    });
    const text = response.choices[0].message.content;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const problem = JSON.parse(jsonMatch[0]);
      problem.id = Date.now();
      return problem;
    }
    return {
      id: 1, title: 'Two Sum', difficulty: 'Easy',
      description: 'Given an array of integers, return indices of two numbers that add up to target.',
      examples: [{ input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' }],
      constraints: ['2 <= nums.length <= 10^4'],
      starterCode: 'function twoSum(nums, target) {\n  // Write your code here\n}',
    };
  } catch (error) {
    console.error('Groq Error:', error.message);
    return {
      id: 1, title: 'Two Sum', difficulty: 'Easy',
      description: 'Given an array of integers, return indices of two numbers that add up to target.',
      examples: [{ input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' }],
      constraints: ['2 <= nums.length <= 10^4'],
      starterCode: 'function twoSum(nums, target) {\n  // Write your code here\n}',
    };
  }
};

// Generate HR questions using AI
const generateHRQuestions = async (role) => {
  if (!client) {
    return [
      'Tell me about a time when you had to work with a difficult team member.',
      'Why are you looking for a change?',
      'Describe a situation where you had to meet a tight deadline.',
      'What is your biggest professional achievement?',
      'How do you handle constructive criticism?',
    ];
  }

  try {
    const response = await client.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are an expert HR interviewer. Generate behavioral interview questions.',
        },
        {
          role: 'user',
          content: `Generate 5 behavioral/HR interview questions for a ${role || 'Software Engineer'} role. Use the STAR method format. Return ONLY the questions, one per line, numbered 1-5.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });
    const text = response.choices[0].message.content;
    return text.split('\n').filter(q => q.trim().length > 0).map(q => q.replace(/^\d+[\.\)]\s*/, '')).slice(0, 5);
  } catch (error) {
    console.error('Groq Error:', error.message);
    return ['Tell me about a time you faced a challenge at work.'];
  }
};

module.exports = { generateQuestions, evaluateAnswer, generateCodingProblem, generateHRQuestions };
