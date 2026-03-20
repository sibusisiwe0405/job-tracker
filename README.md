# 💼 JobTrack — Job Application Tracker

A full stack web application that helps job seekers track and manage their applications in one place. Built with a Node.js/Express REST API, MongoDB database, and a clean vanilla JS frontend.

---


## ✨ Features

- Add, edit and delete job applications
- Track application status — Applied, Interview, Offer, Rejected
- Real-time stats dashboard showing application breakdown
- Filter applications by status
- Email notifications via SendGrid when a status changes
- Persistent data storage with MongoDB

---

## 🛠 Tech Stack

**Backend**
- Node.js
- Express.js
- MongoDB (Mongoose)
- SendGrid Mail API

**Frontend**
- HTML5
- CSS3
- Vanilla JavaScript (Fetch API)

---

---

## ⚙️ Getting Started

### Prerequisites
- Node.js installed
- MongoDB Atlas account
- SendGrid account

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/job-tracker.git
cd job-tracker
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Create your `.env` file inside the `backend` folder
```
MONGO_URI=your_mongodb_connection_string
PORT=3000
SENDGRID_API_KEY=your_sendgrid_api_key
FROM_EMAIL=your_verified_sender_email
```

4. Start the backend server
```bash
node server.js
```

5. Open the frontend
Open `frontend/index.html` directly in your browser

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/applications | Get all applications |
| GET | /api/applications/:id | Get single application |
| POST | /api/applications | Create new application |
| PUT | /api/applications/:id | Update application |
| DELETE | /api/applications/:id | Delete application |

---

## 📧 Email Notifications

When an application status is updated, an automatic email notification is sent via the SendGrid API. This demonstrates real-world third party service integration and webhook-style event driven logic.

---

## 🔮 Future Improvements

- User authentication with JWT
- Email notifications sent to individual user accounts
- Follow up reminders using node-cron scheduler
- Auto logging applications from Gmail confirmation emails
- Mobile responsive design

---

## 👩🏽‍💻 Author

**Sibusisiwe Ndlovu**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [your linkedin url]
- Portfolio: [your portfolio url]