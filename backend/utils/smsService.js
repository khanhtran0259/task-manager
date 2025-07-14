const twilio = require('twilio');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

async function sendAccessCodeSMS(phoneNumber, accessCode) {
      try {
            const message = await client.messages.create({
                  body: `Your access code is: ${accessCode}`,
                  from: process.env.TWILIO_PHONE_NUMBER, 
                  to: phoneNumber
            });
            console.log("SMS sent:", message.sid);
            return message;
      } catch (error) {
            console.error("Error sending SMS:", error);
            throw error;
      }
}


module.exports = { sendAccessCodeSMS };
