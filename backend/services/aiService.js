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

// Safe JSON parser - handles common AI JSON issues
function safeJsonParse(text) {
  // First try direct parse
  try {
    return JSON.parse(text);
  } catch (e) {
    // Try to extract JSON from text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    let jsonStr = jsonMatch[0];

    // Fix common AI JSON mistakes:
    // 1. Remove trailing commas before } or ]
    jsonStr = jsonStr.replace(/,\s*([}\]])/g, '$1');
    // 2. Fix single quotes to double quotes
    jsonStr = jsonStr.replace(/'/g, '"');
    // 3. Fix missing quotes around keys
    jsonStr = jsonStr.replace(/(\{|,)\s*(\w+)\s*:/g, '$1"$2":');
    // 4. Remove comments
    jsonStr = jsonStr.replace(/\/\/.*$/gm, '');
    // 5. Fix newlines in strings
    jsonStr = jsonStr.replace(/\n/g, '\\n');

    try {
      return JSON.parse(jsonStr);
    } catch (e2) {
      console.error('JSON parse failed after cleanup:', e2.message);
      console.error('Attempted to parse:', jsonStr.substring(0, 200));
      return null;
    }
  }
}

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
          content: 'You are an interview evaluator. Evaluate the answer and return a JSON object.',
        },
        {
          role: 'user',
          content: `Question: ${question}\nAnswer: ${answer}\n\nEvaluate this answer and return a JSON object with this EXACT format:\n{"score": 7, "feedback": "your detailed feedback here", "tags": [{"name": "Clarity", "rating": "Good"}, {"name": "Examples", "rating": "Good"}, {"name": "Technical Knowledge", "rating": "Good"}]}\n\nReturn ONLY valid JSON. No extra text. Score must be 1-10.`,
        },
      ],
      temperature: 0.3,
      max_tokens: 500,
      response_format: { type: 'json_object' },
    });
    const text = response.choices[0].message.content;
    const result = safeJsonParse(text);
    if (result && typeof result.score === 'number') {
      // Ensure tags array exists with proper format
      if (!result.tags || !Array.isArray(result.tags)) {
        result.tags = [
          { name: 'Clarity', rating: 'Good' },
          { name: 'Examples', rating: 'Good' },
          { name: 'Technical Knowledge', rating: 'Good' },
        ];
      }
      return result;
    }
    return { score: 5, feedback: text || 'Could not parse evaluation.', tags: [] };
  } catch (error) {
    console.error('Groq Error:', error.message);
    return { score: 5, feedback: 'Could not evaluate answer. Please try again.', tags: [] };
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

Return a JSON object with this EXACT format:
{
  "title": "Problem Title",
  "difficulty": "Easy",
  "description": "Problem description here",
  "examples": [{"input": "input here", "output": "output here", "explanation": "explanation here"}],
  "constraints": ["constraint 1", "constraint 2"],
  "starterCode": "function solution() {\\n  // Write your code here\\n}"
}

Return ONLY valid JSON. No markdown. No extra text.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 800,
      response_format: { type: 'json_object' },
    });
    const text = response.choices[0].message.content;
    const problem = safeJsonParse(text);
    if (problem && problem.title && problem.description) {
      problem.id = Date.now();
      // Ensure examples array exists
      if (!problem.examples || !Array.isArray(problem.examples)) {
        problem.examples = [{ input: 'Example input', output: 'Example output', explanation: 'Explanation' }];
      }
      // Ensure constraints array exists
      if (!problem.constraints || !Array.isArray(problem.constraints)) {
        problem.constraints = ['No specific constraints'];
      }
      // Ensure starterCode exists
      if (!problem.starterCode) {
        problem.starterCode = 'function solution() {\n  // Write your code here\n}';
      }
      return problem;
    }
    return {
      id: 1, title: 'Two Sum', difficulty: 'Easy',
      description: 'Given an array of integers, return indices of two numbers that add up to target.',
      examples: [{ input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'nums[0] + nums[1] == 9' }],
      constraints: ['2 <= nums.length <= 10^4'],
      starterCode: 'function twoSum(nums, target) {\n  // Write your code here\n}',
    };
  } catch (error) {
    console.error('Groq Error:', error.message);
    return {
      id: 1, title: 'Two Sum', difficulty: 'Easy',
      description: 'Given an array of integers, return indices of two numbers that add up to target.',
      examples: [{ input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'nums[0] + nums[1] == 9' }],
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
