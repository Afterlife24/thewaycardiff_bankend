const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Email transporter configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
    const { firstName, lastName, email, phone, message } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !message) {
        return res.status(400).json({
            success: false,
            message: 'Please fill in all required fields'
        });
    }

    // Current timestamp
    const timestamp = new Date().toLocaleString();

    // Professional Email Template
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.RECIPIENT_EMAIL,
        subject: `📩 New Contact Form Submission - ${firstName} ${lastName}`,
        replyTo: email,
        html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
            
            <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                
                <!-- Header -->
                <div style="background: #4CAF50; color: white; padding: 20px; text-align: center;">
                    <h2 style="margin: 0;">📩 New Contact Message</h2>
                </div>

                <!-- Body -->
                <div style="padding: 20px; color: #333;">
                    
                    <p style="font-size: 16px;">You received a new message from your website:</p>

                    <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                        <tr>
                            <td style="padding: 10px; font-weight: bold;">Name:</td>
                            <td style="padding: 10px;">${firstName} ${lastName}</td>
                        </tr>
                        <tr style="background: #f9f9f9;">
                            <td style="padding: 10px; font-weight: bold;">Email:</td>
                            <td style="padding: 10px;">${email}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; font-weight: bold;">Phone:</td>
                            <td style="padding: 10px;">${phone || 'Not provided'}</td>
                        </tr>
                        <tr style="background: #f9f9f9;">
                            <td style="padding: 10px; font-weight: bold;">Time:</td>
                            <td style="padding: 10px;">${timestamp}</td>
                        </tr>
                    </table>

                    <!-- Message Box -->
                    <div style="margin-top: 20px;">
                        <p style="font-weight: bold;">Message:</p>
                        <div style="background: #f1f1f1; padding: 15px; border-radius: 5px; line-height: 1.5;">
                            ${message}
                        </div>
                    </div>

                </div>

                <!-- Footer -->
                <div style="background: #f4f6f8; text-align: center; padding: 15px; font-size: 12px; color: #777;">
                    <p style="margin: 0;">This email was sent from your website contact form</p>
                </div>

            </div>

        </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);

        res.status(200).json({
            success: true,
            message: 'Message sent successfully!'
        });

    } catch (error) {
        console.error('Error sending email:', error);

        res.status(500).json({
            success: false,
            message: 'Failed to send message. Please try again later.'
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Start server (only if not Lambda)
if (!process.env.LAMBDA_TASK_ROOT) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;