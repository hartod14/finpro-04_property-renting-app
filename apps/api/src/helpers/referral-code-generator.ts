// export function generateReferralCode(): string {
//   // implement logic to generate a unique referral code
//   return 'REF-' + Math.random().toString(36).substr(2, 9).toUpperCase();
// }

export function generateReferralCode(): string {
  const letters = Array.from({ length: 3 }, () =>
      String.fromCharCode(65 + Math.floor(Math.random() * 26))
  ).join(""); // Generate 3 random uppercase letters (A-Z)

  const numbers = Math.floor(10000 + Math.random() * 90000).toString(); // Generate a 5-digit number

  return `${letters}${numbers}`;
}

