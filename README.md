
# Anatomize

Anatomize is an interactive anatomy learning app built with React Native (Expo) and a Node.js + Express backend. It combines structured anatomy summaries, interactive quizzes, and a GPT-powered chat tutor to support medical and life-science students.

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
| **State Management** | **TO DO:** add useReducer for global state for a checkmarks that appear when summary, quiz completed |
| **Persistence** | **TO DO:** implement React Native AsyncStorage for persisting chat history |
| **Notifications** | **TO DO:** integrate Expo Notifications for daily study reminders |
| **Styling** | React Native `StyleSheet` |
| **Deployment** |  **TO DO:** finalize EAS Build and generate APK/Expo link |

## Features
- **Home Screen:** Displays all anatomical regions (Back, Thorax, Abdomen, ...)  
- **Summaries:** Markdown-based content explaining regional anatomy.  
- **Chat Tutor:** GPT-powered interactive dialogue for each region.  
- **Quizzes:** Multiple-choice questions with explanations and animations. 

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
npm install -g nodemon
npm run dev   
```

## Deployment Information
TODO

## Individual Contributions
Gleb developed the core frontend components using Expo Router.   
Gleb built the backend server.    
Gleb integrated the OpenAI API.   
Ian implemented state management to show a checkmark beside the region  that a summary was read and another checkmark when the 3 quiz questions are correctly completed. The checkmarks are on the region in the homescreen (index.tsx).   
Ian added persistent chat history.    
Ian set up notifications.     
Ian deployed the app.     

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
TO DO: Use useReducer to manage state (region checkmarks).      
TO DO: Add AsyncStorage to persist chat history across app restarts.

#### Notifications
TO DO: Implement Expo Notifications for daily study reminders.

#### Backend Integration
Backend built with Node.js + Express.         
Integrated with the OpenAI API for GPT-based tutoring responses.      
Uses fetch() on the frontend to send chat data and receive AI-generated replies.

#### Deployment
TO DO: Deploy using Expo EAS Build and provide APK or Expo Go link.

#### Advanced Features
TO DO

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



