// Built-in default question bank — loaded by host.html and admin.html only.
// (player.html no longer loads this file: players receive the questions for
// their room live from Firebase, since the host can now pick any quiz set
// created in the admin console, not just this default one.)
// answer = index (0-3) of the correct option.
const DEFAULT_QUESTIONS = [
  { q: "What is Artificial Intelligence, in simple terms?", options: [
      "Software that performs tasks normally requiring human thinking, like recognizing patterns and understanding language",
      "A robot that physically resembles a human",
      "A type of computer virus",
      "A system that only works without electricity"
    ], answer: 0 },
  { q: "Which of these is an example of Generative AI?", options: [
      "A calculator", "ChatGPT or Claude", "A spreadsheet formula", "A barcode scanner"
    ], answer: 1 },
  { q: "What does LLM stand for?", options: [
      "Long Learning Machine", "Large Language Model", "Live Language Module", "Linked Logic Model"
    ], answer: 1 },
  { q: "Which company makes the Claude AI model?", options: [
      "OpenAI", "Google", "Anthropic", "Meta"
    ], answer: 2 },
  { q: "In simple terms, how does an LLM generate its response?", options: [
      "It looks up the exact answer in a fixed database",
      "It predicts the most likely next word, over and over",
      "It randomly picks words with no pattern",
      "It calls a human operator to type the answer"
    ], answer: 1 },
  { q: "What is a \"token\" in the context of AI?", options: [
      "A password used to log into an AI tool",
      "A small piece of text — roughly part of a word — that the AI reads and generates",
      "A reward point given to frequent AI users",
      "A type of computer chip"
    ], answer: 1 },
  { q: "What does the \"context window\" refer to?", options: [
      "The size of the screen you're using",
      "How much text the AI can consider or \"remember\" at once",
      "The time of day the AI works best",
      "The number of users allowed at once"
    ], answer: 1 },
  { q: "If you want the AI's answers to be more focused and predictable (e.g. for facts or code), what should you do with temperature?", options: [
      "Set it high", "Set it low", "Turn it off completely", "Temperature has no effect on responses"
    ], answer: 1 },
  { q: "What is a \"prompt\"?", options: [
      "A software bug",
      "Your instruction or question typed to the AI",
      "A type of AI hallucination",
      "The AI's internal programming language"
    ], answer: 1 },
  { q: "What is \"few-shot\" prompting?", options: [
      "Asking the AI a question with zero examples",
      "Giving the AI several examples before asking it to perform a task",
      "Asking the AI to respond in under five seconds",
      "Limiting the AI to five words per answer"
    ], answer: 1 },
  { q: "What is an AI \"hallucination\"?", options: [
      "When the AI stops working entirely",
      "When the AI confidently states something false or made up",
      "When the AI asks the user a clarifying question",
      "When the AI runs out of tokens"
    ], answer: 1 },
  { q: "What does RAG (Retrieval-Augmented Generation) allow an AI to do?", options: [
      "Search your own documents or data before answering",
      "Automatically fix its own hallucinations",
      "Run without any internet connection",
      "Generate images instead of text"
    ], answer: 0 },
  { q: "What is the main benefit of running a \"local\" AI model (e.g. with Ollama or LM Studio)?", options: [
      "It's always smarter than cloud AI",
      "Your data stays on your own computer, improving privacy",
      "It requires no computer at all",
      "It automatically updates itself daily"
    ], answer: 1 },
  { q: "What is an AI \"agent\"?", options: [
      "A customer service employee who uses AI tools",
      "AI that can take multi-step actions, like updating a spreadsheet or sending an email",
      "A licensed AI salesperson",
      "A type of firewall software"
    ], answer: 1 },
  { q: "Which of the following is a responsible AI practice?", options: [
      "Sharing confidential company data freely with any AI tool",
      "Trusting every AI answer without checking it",
      "Verifying important facts and keeping a human in the loop for high-stakes decisions",
      "Avoiding AI tools completely at all times"
    ], answer: 2 },

  // --- extra questions ---
  { q: "What does it mean when an AI model is described as \"multimodal\"?", options: [
      "It can understand and work with more than one type of input, like text, images, and audio",
      "It has multiple personalities it can switch between",
      "It runs on multiple computers at the same time",
      "It supports multiple human languages only"
    ], answer: 0 },
  { q: "What is \"fine-tuning\" an AI model?", options: [
      "Adjusting your screen brightness while you use the AI",
      "Further training an existing model on specific data to specialize it for a task",
      "Speeding up how fast the AI types its answers",
      "Deleting parts of the model to make it smaller"
    ], answer: 1 },
  { q: "In AI, what is an \"embedding\"?", options: [
      "A physical chip built into a computer",
      "A numerical representation of text or images that captures its meaning, so similar things end up with similar numbers",
      "A hidden message secretly inserted into AI output",
      "A type of encryption used for chat logs"
    ], answer: 1 },
  { q: "What is \"zero-shot\" prompting?", options: [
      "Asking the AI to complete a task with no examples given, just instructions",
      "Giving the AI zero words to work with",
      "Turning off the AI's memory before asking",
      "Asking the same question with zero follow-ups"
    ], answer: 0 },
  { q: "What is a \"prompt injection\" attack?", options: [
      "A software update that patches an AI model",
      "Hiding malicious instructions inside content — like a webpage or document — to try to hijack what the AI does",
      "Adding extra memory to a server that runs AI",
      "A formal process for submitting feature requests to an AI company"
    ], answer: 1 },
  { q: "What does MCP (Model Context Protocol) let an AI assistant do?", options: [
      "Connect to outside tools and data sources — like a calendar or project tracker — using one standard method",
      "Compress its responses to save storage space",
      "Automatically multiply the size of its context window",
      "Chat directly with other AI models"
    ], answer: 0 },
];

const DEFAULT_QUESTION_SECONDS = 20; // time allowed per question, for the default set

// Default "last place dare" bank — light, silly, opt-in prompts the host can
// spin for the lowest scorer at the end of a game. Fully editable in
// admin.html; this list is just the starting seed the first time it runs.
const DEFAULT_DARES = [
  "Do your best robot impression for 10 seconds.",
  "Let the winner rename you (nicely!) for the rest of the day.",
  "Speak in a movie-trailer voice for the next 3 sentences you say.",
  "Give the group a 10-second motivational speech about losing.",
  "Do 5 jumping jacks right now.",
  "Send a party emoji to the group chat and declare 'AI is undefeated.'",
  "Compliment the winner in the most dramatic way possible.",
  "Do your best AI-voice-assistant impression to answer the next question.",
  "Strike a superhero pose for a photo.",
  "Hum the theme song of your favorite show for 10 seconds.",
];
