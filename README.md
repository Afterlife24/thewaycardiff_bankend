# The Way Church - Backend API

Simple Node.js backend for handling contact form submissions and sending emails.

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the backend folder:
```bash
cp .env.example .env
```

Edit `.env` and add your email credentials:
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
RECIPIENT_EMAIL=church-email@example.com
PORT=5000
```

### 3. Gmail Setup (if using Gmail)
1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Generate an App Password:
   - Go to Security > 2-Step Verification > App passwords
   - Select "Mail" and your device
   - Copy the generated password and use it as EMAIL_PASS

### 4. Run the Server

Development mode (with auto-restart):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### POST /api/contact
Submit contact form data

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "message": "Hello, I have a question..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Message sent successfully!"
}
```

### GET /api/health
Check if server is running

**Response:**
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

## Deployment Options

### Option 1: AWS EC2
1. Launch an EC2 instance
2. Install Node.js
3. Clone your repository
4. Install dependencies
5. Set up environment variables
6. Use PM2 to keep the server running:
   ```bash
   npm install -g pm2
   pm2 start server.js
   pm2 startup
   pm2 save
   ```

### Option 2: AWS Lambda + API Gateway
1. Package the code
2. Create a Lambda function
3. Set up API Gateway
4. Configure environment variables in Lambda

### Option 3: Heroku (Easy deployment)
1. Create a Heroku account
2. Install Heroku CLI
3. Run:
   ```bash
   heroku create your-app-name
   heroku config:set EMAIL_USER=your-email@gmail.com
   heroku config:set EMAIL_PASS=your-app-password
   heroku config:set RECIPIENT_EMAIL=church-email@example.com
   git push heroku main
   ```

## Frontend Integration

Update the form action in your React app to point to your backend URL:

```javascript
// In src/pages/Home.js
<form className="contact-form" method="POST" action="http://your-backend-url/api/contact">
```

Or use fetch/axios for better control:
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);
  
  const response = await fetch('http://your-backend-url/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  const result = await response.json();
  alert(result.message);
};
```

## Security Notes

- Never commit `.env` file to git
- Use environment variables for sensitive data
- Enable CORS only for your frontend domain in production
- Consider rate limiting for production
- Use HTTPS in production

## Troubleshooting

**Email not sending:**
- Check your email credentials
- Make sure 2FA and App Password are set up correctly
- Check firewall settings
- Verify SMTP settings for your email provider

**CORS errors:**
- Make sure the backend URL is correct in frontend
- Check CORS configuration in server.js
