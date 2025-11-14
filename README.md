
# Anatomize

Anatomize is an interactive anatomy learning app built with React Native (Expo) and a Node.js + Express backend. It combines structured anatomy summaries, interactive quizzes, and a GPT-powered chat tutor to support medical and life-science students.

## To Do
1. Implement checkmark for using chat function for 3 messages. 
2. Store more quiz questions in the backend, retrieve them in frontend when online. 
3. Add more custom animation? 
4. Deploy.  

## Team Information
Gleb Zvonkov, gleb.zvonkov@mail.utoronto.ca  
Ian Lee, ianx.lee@mail.utoronto.ca

## Motivation
Understanding human anatomy can be overwhelming due to the large amount of memorization required. *Anatomize* was created to make this process interactive, structured, and engaging by combining region-based summaries, quizzes, and a GPT-powered chat tutor. The goal is to allow students to actively learn through conversation and self-testing rather than passive reading.

## Objectives
- Create a mobile app that helps anatomy students learn efficiently.
- Integrate AI-driven tutoring to generate adaptive explanations. 
- Provide summaries and quizzes organized by anatomical regions.  
- Design a clean, mobile-friendly user interface. 

## Technical Stack
| Component | Technology |
|------------|-------------|
| **Frontend** | React Native with TypeScript |
| **Navigation** | Expo Router |
| **Backend** | Node.js + Express  |
| **AI Integration** | OpenAI API  |
| **State Management** | Context + useReducer (region progress + notification permissions) |
| **Persistence** | AsyncStorage for chat history and progress |
| **Notifications** | Expo Notifications for local tutor-reply alerts |
| **Styling** | React Native `StyleSheet` |
| **Deployment** |  Expo / EAS (see Deployment section) |

## Features
- **Home Screen:** Displays all anatomical regions (Back, Thorax, Abdomen, ...)  
- **Summaries:** Markdown-based content explaining regional anatomy with automatic “read” tracking.  
- **Chat Tutor:** GPT-powered interactive dialogue for each region.  
- **Chat History Persistence:** Region-specific conversations are saved locally so you can resume later.  
- **Quizzes:** Multiple-choice questions with explanations and animations plus mastery tracking (3 correct answers). 
- **Progress Badges:** Summary/quiz completion checkmarks appear on each region card.  
- **Notifications:** Local alerts fire when new tutor replies arrive (requires user permission). 

## User Guide
- **Home Screen:** Tap an anatomical region to expand available modes *Summary*, *Chat*, *Quiz*.  
- **Summary:** Read key anatomical details.  
- **Chat:** Ask the AI tutor questions about the selected region.  
- **Quiz:** Answer randomized multiple-choice questions and view explanations. 

## Development Guide
To start the frontend
```
cd frontend      
npm install       
npx expo start  
```    

To start the backend
```
cd backend 
npm install
create an .env file with OPENAI_API_KEY 
npm run dev   
```

### Environment variables
- `backend/.env` &rarr; `OPENAI_API_KEY=<your OpenAI key>`  
- `frontend` &rarr; create (or extend) `app.config.js`/shell env with `EXPO_PUBLIC_API_URL=https://your-backend-host` so the mobile app knows where to send chat requests.

## Deployment Information
See `DEPLOYMENT.md` for step-by-step frontend (Expo Publish / EAS) and backend hosting instructions. Actual publishing requires access to your Expo account and production backend credentials, so the repo only contains the documented process.

## Individual Contributions
Gleb developed the core frontend components using Expo Router.   
Gleb built the backend server.    
Gleb integrated the OpenAI API.   
Ian implemented global progress tracking with useReducer to show summary/quiz completion checkmarks on the home screen.   
Ian added persistent chat history per region and wired Expo Notifications for tutor reply alerts.    
Ian documented the deployment plan and test matrix.     

## Lesson Learned
TODO

## Concluding Remarks 
TODO

## Project Requirements 
#### React Native and Expo Development
Built with React Native (Expo) using TypeScript.       
Includes four main screens: Home, Summary, Chat, and Quiz.     
Uses core React Native components (View, Text, TextInput, FlatList) and hooks (useState, useEffect).

#### Navigation
Implemented with Expo Router using file-based routing in the /app directory.      
Dynamic routes like [region].tsx handle navigation between anatomical regions.

#### State Management and Persistence
Uses Context + useReducer to track summary/quiz completion per region (with persistence).      
Chat history is saved in AsyncStorage so conversations survive app restarts.

#### Notifications
Expo Notifications request permissions on launch and dispatch a local alert whenever a new tutor reply finishes streaming.

#### Backend Integration
Backend built with Node.js + Express.         
Integrated with the OpenAI API for GPT-based tutoring responses.      
Uses fetch() on the frontend to send chat data and receive AI-generated replies.

#### Advanced Feature 1: Custom Animations 
React Native’s Animated API in Quiz.

### Advanced Feature 2: Integration with External Services
Use OpenAI api.

### Advanced Feature 3: Gamification
Progress tracking on each screen.
Global progress tracking on home screen. 

### Advanced Feature 3: Offline Support
Save past GPT conversations in chat screen to view offline. 

#### Deployment
Documented Expo Publish / EAS build workflow (requires Expo credentials).

#### Advanced Features
- Region progress visualization with dual checkmarks.  
- Persistent GPT chat with animated type-out effect.  
- Quiz mastery tracking (requires three correct answers per region).  
- Local tutor reply notifications.

## Project Structure
├── backend/ # Node.js + Express REST API
│ ├── server.js # Handles GPT requests and quiz endpoints
│ ├── regionPrompts.js # Prompt templates per body region
│ ├── .env # API key for GPT
│
├── frontend/ # React Native (Expo) mobile app
│ ├── app/ # Screens and navigation
│ │ ├── index.tsx # Home screen
│ │ ├── summary/[region].tsx # Region summaries
│ │ ├── chat/[region].tsx # GPT chat interface
│ │ └── quiz/[region].tsx # Interactive quizzes
│ ├── data/ # Static data (summaries, quiz questions)
│ ├── region_images/ # Region icons
│ ├── screen_images/ # summary, gpt, quiz icons
│
└── types.ts # contains TypeScript type region 


