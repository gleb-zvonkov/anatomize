
# Anatomize

Anatomize is an interactive anatomy learning app built with React Native (Expo) and a Node.js + Express backend. It combines structured anatomy summaries, interactive quizzes, and a GPT-powered chat tutor to support medical and life-science students.
 
## Team Information
Gleb Zvonkov, gleb.zvonkov@mail.utoronto.ca  
Ian Lee, ianx.lee@mail.utoronto.ca

## Video Demo 
Google Drive: https://drive.google.com/file/d/1_rzMfEMnJE1Cg_WgSDlH6mUTfv3sVTNd/view?usp=sharing 

OneDrive: https://utoronto-my.sharepoint.com/personal/gleb_zvonkov_mail_utoronto_ca/_layouts/15/stream.aspx?id=%2Fpersonal%2Fgleb%5Fzvonkov%5Fmail%5Futoronto%5Fca%2FDocuments%2FDemo%2Emov&nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0NvcHkifX0&ga=1&referrer=StreamWebApp%2EWeb&referrerScenario=AddressBarCopied%2Eview%2Ec94c5792%2D13cb%2D4540%2Dabd4%2D227eda659886

## Motivation
Understanding human anatomy can be overwhelming due to the large amount of memorization required. *Anatomize* was created to make this process interactive, structured, and engaging by combining region-based summaries, quizzes, and a GPT-powered chat tutor. 

## Objectives
- Create a mobile app that helps anatomy students learn efficiently.
- Design a clean, mobile-friendly user interface. 
- Provide summaries and quizzes organized by anatomical regions.  
- Integrate AI-driven tutoring. 
- Progress tracking to see what you mastered.

## Technical Stack
| Component | Technology |
|------------|-------------|
| **Frontend** | React Native with TypeScript |
| **Navigation** | Expo Router |
| **Backend** | Node.js + Express  |
| **AI Integration** | OpenAI API  |
| **State Management** | Context + useReducer for region progress  |
| **Persistence** | AsyncStorage for chat history and progress |
| **Notifications** | Expo Notifications for local tutor-reply alerts |
| **Styling** | React Native `StyleSheet` |
| **Deployment** |  Expo / EAS |

## Features
#### React Native and Expo Development
Built with React Native (Expo).
TypeScript ensures that only valid, predefined region names can be used throughout the app.
Includes four main screens: Home, Summary, Chat, and Quiz.     
Uses core React Native components (View, Text, TextInput, FlatList) and hooks (useState, useEffect).

#### Navigation
Implemented with Expo Router using file-based routing.      
Dynamic routes `[region].tsx` handle navigation between anatomical regions.     
`app/index.tsx` — Home screen listing all anatomical regions.      
`app/summary/[region].tsx` — Shows the summary for a selected region.     
`app/quiz/[region].tsx` — Displays the interactive quiz for that region.    
`app/chat/[region].tsx` — AI chat tutor for the chosen region.   

#### State Management 
Uses Context + useReducer to track completion of tasks for each region.    
Reading a summary is recorded in global state.    
Interacting with the GPT chat for several messages is recorded in global state.    
Correctly answering three quiz questions is recorded in global state.      
The home screen displays a checkmark beside each region to show which tasks (summary, quiz, chat) have been completed.        
Below is an example of our AppState object:
```
{
  notificationsGranted: false,
  progress: {
    back: {
      summaryRead: false,
      quizCorrectCount: 0,
      quizComplete: false,
      correctQuestionIds: [],
      chatCount: 0,
      chatComplete: false
    },

    abdomen: {
      summaryRead: false,
      quizCorrectCount: 0,
      quizComplete: false,
      correctQuestionIds: [],
      chatCount: 0,
      chatComplete: false
    },

    thorax: {
      summaryRead: false,
      quizCorrectCount: 0,
      quizComplete: false,
      correctQuestionIds: [],
      chatCount: 0,
      chatComplete: false
    },

    ...
 
  }
}
```

#### Persistence
Chat history is saved in AsyncStorage so conversations survive app restarts.     
Global state is also persisted, ensuring that completion records for summary, chat, and quiz tasks remain intact even after closing or restarting the app

#### Notifications
Expo Notifications request permissions on launch and dispatch a local alert whenever a new tutor reply finishes streaming.

#### Backend Integration
Backend built with Node.js + Express.        
One route fetches GPT-generated chat tutor replies for a specific region.     
One route fetches an GPT-generated quiz question for a specific region.    
Both routes use the OpenAI API to dynamically generate content.   

#### Advanced Feature 1: Custom Animations 
React Native’s Animated module is used to create smooth fade transitions between quiz questions. The ConfettiCannon component from react-native-confetti-cannon is used to display a celebration effect when the user completes three quiz questions.

#### Advanced Feature 2: Integration with External Services
The app connects to the OpenAI GPT API to generate anatomy tutor chat
responses and dynamically created multiple-choice quiz questions for each region.

#### Advanced Feature 3: Gamification
Gamification is implemented through real-time quiz tracking and quiz/summary/chat tracking on the home screen. Each quiz screen dynamically tracks correct answers, and confetti is triggered after three correct responses. The home screen shows a progress tracker for each region, displaying checkmarks for completed summary, quiz, and chat tasks.

#### Advanced Feature 4: Offline Support
The app supports offline usage by falling back on locally stored data when the backend is unreachable. Specifically, if the backend can't generate a quiz question, the app uses preloaded local questions instead. Furthermore, tutor chat conversations are saved in local storage (via AsyncStorage), allowing users to review past messages even when offline.

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

There are two important envrionment vairbales:      
1. `backend/.env` which contains `OPENAI_API_KEY=<your OpenAI key>`.    
2. In the frontend set `EXPO_PUBLIC_API_URL=https://your-backend-host`, otherwise, it falls back to a default URL based on your local Expo environment.

## Deployment Information
See `DEPLOYMENT.md` for step-by-step frontend (Expo Publish / EAS) and backend hosting instructions. Actual publishing requires access to your Expo account and production backend credentials, so the repo only contains the documented process.

## Individual Contributions
Gleb developed the core frontend components using Expo Router.   
Gleb built the backend server.    
Gleb implemented quiz retrieval from the backend.     
Gleb implemented quiz retrieval locally.     
Gleb implemented custom animations, including the confetti effect.      
Ian implemented global progress tracking with useReducer to show summary, quiz, and chat completion checkmarks on the home screen.     
Ian added persistent chat history per region.       
Ian wired up Expo Notifications for tutor reply alerts.   
Ian deploy the app.         
Ian documented the deployment plan.     

## Lesson Learned
Designing a smooth user experience across both frontend and backend requires careful handling of state, persistence, and API communication. We learned how to structure React Native projects for modularity, scalability, and offline support. Integrating OpenAI's API taught us how to handle asynchronous data generation and error cases gracefully.        

## Concluding Remarks 
This project successfully brought together multiple technologies to build an interactive, educational mobile app. The modular design and region-based content structure make it easy to extend the app in the future.


## Project Structure
```
backend/                     # Node.js + Express API (chat + quiz)
│   server.js                # Main backend server
│   gptPrompts.js            # GPT system prompts for chat + quiz
│   .env                     # OpenAI API key + environment config
│   package.json             # Backend dependencies

frontend/                    # Expo React Native mobile app
│
│ app/                       # All screens (Expo Router)
│   ├── index.tsx            # Home screen
│   ├── summary/[region].tsx # Summary screen per region
│   ├── chat/[region].tsx    # GPT chat screen
│   └── quiz/[region].tsx    # Quiz screen
│
│ constants/                 # Global region lists + images
│   regions.ts               # REGION_ITEMS, ALL_REGIONS, regionImages
│
│ context/                   # Global state (progress, notifications)
│   AppStateContext.tsx
│
│ data/                      # Local study content
│   summaries.ts             # Hardcoded summaries
│   quiz_questions.ts        # Fallback local quiz questions
│
│ region_images/             # Icons for region buttons
│
│ types/                     # Shared TypeScript types
│   types.ts                 # Region, Message
│
│ utils/
│   api.ts                   # API_BASE_URL resolver
│
│ app.json / eas.json        # Expo & EAS config
│ package.json               # App dependencies

```


