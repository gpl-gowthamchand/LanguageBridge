# LanguageBridge

LanguageBridge is a multilingual translation web application that supports text translation, speech-to-text, text-to-speech, and file import/export. This project was developed as part of my final year project, leveraging tools like ChatGPT and GitHub Copilot for assistance.

---

## Overview

LanguageBridge provides seamless translation capabilities using advanced machine translation services like mBART, Google Translate, and LibreTranslate. It also includes features like automatic language detection, voice input/output, and file handling, making it a comprehensive tool for multilingual communication.

---

## Features

- Multilingual text translation.
- Speech-to-text conversion for voice input.
- Text-to-speech conversion for voice output.
- Automatic language detection for input text or speech.
- File import/export for translation tasks.
- Responsive design for desktop and mobile devices.
- Theme toggle (light/dark mode).

---

## Technologies Used

### **Frontend**
- **React.js**: For building the user interface.
- **TypeScript**: For type-safe JavaScript development.
- **Tailwind CSS**: For styling and utility-first CSS framework.
- **Radix UI**: For accessible UI components (e.g., `Select`, `Accordion`).
- **Lucide Icons**: For icons used in the UI.
- **React Router**: For client-side routing.
- **React Query**: For managing server state and API calls.

### **Backend/Services**
- **Hugging Face API**: For machine translation using the `facebook/mbart-large-50-many-to-many-mmt` model.
- **Google Translate API**: For translation services.
- **LibreTranslate API**: For open-source translation services.
- **Mock Translator**: A fallback service for translations when APIs fail.

### **Speech Processing**
- **Web Speech API**: For speech-to-text and text-to-speech functionality.

### **Hosting**
- **Netlify**: For hosting the frontend application.

### **Environment Management**
- **dotenv**: For managing environment variables (e.g., API keys).

### **Utilities**
- **Sonner**: For toast notifications.
- **Class Variance Authority (CVA)**: For managing class names dynamically.
- **clsx** and **tailwind-merge**: For conditional class merging.

### **AI Assistance**
- **GitHub Copilot**: For code suggestions and auto-completion during development.
- **ChatGPT**: For debugging, generating ideas, and providing technical guidance.

### **Other Tools**
- **Vite**: For fast development and build tooling.
- **GitHub**: For version control and collaboration.

---

## Hosted Link

You can access the application here:  
[LanguageBridge Online](https://language-bridge.netlify.app/)

---

## Documentation

For detailed information about the project, refer to the documentation:  
[View Full Documentation](./docs/machine-translation-documentation.md)

---

## Contributing

Contributions are welcome! If you'd like to contribute to LanguageBridge, please follow these steps:

1. **Fork the Repository**: Click the "Fork" button at the top of this repository.
2. **Clone Your Fork**: Clone your forked repository to your local machine.
   ```bash
   git clone https://github.com/gpl-gowthamchand/LanguageBridge.git