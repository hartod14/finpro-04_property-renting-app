import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_USER, 
    pass: process.env.NODEMAILER_PASS, 
  },
});


function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };
  return date.toLocaleDateString('en-US', options);
}

export async function sendConfirmationEmail(
  to: string,
  booking: {
    id: number;
    order_number: string;
    checkin_date: Date;
    checkout_date: Date;
    room: {
      name: string;
      property: {
        name: string;
        address: string;
      };
    };
  }
) {
  console.log("Preparing to send email...");

  const mailOptions = {
    from: process.env.NODEMAILER_USER,
    to,
    subject: "Payment Confirmation Received",
    html: `
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Payment Confirmation</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              background-color: #f7f7f7;
              margin: 0;
              padding: 0;
              color: #333;
            }
            .container {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 10px;
              box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
              padding: 20px;
            }
            h3 {
              color: #4CAF50;
              font-size: 24px;
              margin-bottom: 10px;
            }
            p {
              font-size: 16px;
              line-height: 1.6;
            }
            .order-info {
              background-color: #f9f9f9;
              padding: 15px;
              border-radius: 5px;
              margin-bottom: 20px;
            }
            .order-info ul {
              list-style-type: none;
              padding: 0;
            }
            .order-info li {
              font-size: 14px;
              margin: 8px 0;
            }
            .order-info strong {
              color: #333;
            }
            .footer {
              text-align: center;
              font-size: 14px;
              color: #777;
              margin-top: 20px;
            }
            .btn {
              display: inline-block;
              background-color: #4CAF50;
              color: #fff;
              padding: 10px 20px;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
              text-align: center;
              margin-top: 15px;
              text-color: #FFFFFF
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h3>Your Payment Has Been Confirmed!</h3>
            <p>Thank you for your payment. Below are the details of your booking:</p>

            <div class="order-info">
              <ul>
                <li><strong>Order Number:</strong> ${booking.order_number}</li>
                <li><strong>Property:</strong> ${booking.room.property.name}</li>
                <li><strong>Room:</strong> ${booking.room.name}</li>
                <li><strong>Address:</strong> ${booking.room.property.address}</li>
                <li><strong>Check-in:</strong> ${formatDate(booking.checkin_date)}</li>
                <li><strong>Check-out:</strong> ${formatDate(booking.checkout_date)}</li>
              </ul>
            </div>

            <p>Please prepare for your check-in according to the scheduled date.</p>

            <div class="footer">
              <p>If you need assistance, please contact us at <a href="mailto:support@example.com">support@example.com</a></p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    console.log("Sending email to:", to);
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
}
