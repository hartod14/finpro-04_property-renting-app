import nodemailer from "nodemailer";

// Konfigurasi transporter (gunakan kredensial SMTP kamu)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_USER, // Email pengirim
    pass: process.env.NODEMAILER_PASS, // Password atau App Password
  },
});

// Kirim email konfirmasi booking diterima
export async function sendConfirmationEmail(
  to: string,
  booking: {
    id: number;
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
  const mailOptions = {
    from: process.env.NODEMAILER_USER,
    to,
    subject: "Konfirmasi Pembayaran Diterima",
    html: `
      <h3>Pembayaran Anda Dikonfirmasi!</h3>
      <p>Terima kasih telah melakukan pembayaran. Berikut detail pesanan Anda:</p>
      <ul>
        <li><strong>ID Booking:</strong> ${booking.id}</li>
        <li><strong>Properti:</strong> ${booking.room.property.name}</li>
        <li><strong>Kamar:</strong> ${booking.room.name}</li>
        <li><strong>Alamat:</strong> ${booking.room.property.address}</li>
        <li><strong>Check-in:</strong> ${booking.checkin_date.toDateString()}</li>
        <li><strong>Check-out:</strong> ${booking.checkout_date.toDateString()}</li>
      </ul>
      <p>Silakan bersiap untuk check-in sesuai jadwal.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}

// Kirim pengingat H-1 sebelum check-in
export async function sendReminderEmail(
  to: string,
  booking: {
    id: number;
    checkin_date: Date;
    room: {
      name: string;
      property: {
        name: string;
        address: string;
      };
    };
  }
) {
  const mailOptions = {
    from: process.env.NODEMAILER_USER,
    to,
    subject: "Pengingat Check-In",
    html: `
      <h3>Pengingat Check-In</h3>
      <p>Halo, ini adalah pengingat bahwa Anda akan check-in besok. Berikut detailnya:</p>
      <ul>
        <li><strong>ID Booking:</strong> ${booking.id}</li>
        <li><strong>Properti:</strong> ${booking.room.property.name}</li>
        <li><strong>Kamar:</strong> ${booking.room.name}</li>
        <li><strong>Alamat:</strong> ${booking.room.property.address}</li>
        <li><strong>Tanggal Check-in:</strong> ${booking.checkin_date.toDateString()}</li>
      </ul>
      <p>Harap hadir tepat waktu dan persiapkan semua kebutuhan Anda.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}
