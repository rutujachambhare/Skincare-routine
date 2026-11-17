# 🌸 Glow & Care – Skincare Routine Website

## 📌 About the Project

**Glow & Care** is a skincare routine recommendation website designed to help users choose a suitable skincare routine according to their skin type. Users can select their skin type and get morning, night, and weekly skincare routines along with recommended skincare products and useful skincare tips.

The website provides a simple, attractive, and user-friendly interface with a soft pastel colour theme.

## ✨ Features

- Select from five skin types:
  - Oily Skin
  - Dry Skin
  - Combination Skin
  - Normal Skin
  - Sensitive Skin
- Get personalized skincare routine suggestions.
- Morning and night skincare routines.
- Weekly skincare routine suggestions.
- Recommended skincare products.
- Useful skincare tips.
- Save and view previous skin type selections.
- Delete saved history.
- Daily skincare checklist.

## 🛠️ Technologies Used

- **HTML** – Structure of the website.
- **CSS** – Styling and website design.
- **JavaScript** – Interactive features and API communication.
- **Node.js** – Backend runtime environment.
- **Express.js** – Backend framework.
- **JSON** – Store user selection history.

## 📂 Project Structure

```text
glow-skincare/
│
├── server.js
├── package.json
├── data.json
│
└── public/
    ├── index.html
    ├── style.css
    └── script.js
```

## 🚀 How to Run the Project

1. Download or clone this repository.
2. Open the project folder in Visual Studio Code.
3. Open the terminal in VS Code.
4. Install the required packages:
npm install
5. Start the server:
node server.js
6. Open your browser and visit:
http://localhost:3000

## 🔗 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/routines` | Get all skincare routines |
| GET | `/api/routines/:skinType` | Get routine for a selected skin type |
| POST | `/api/selections` | Save
