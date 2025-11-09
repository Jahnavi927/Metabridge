import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

async function test() {
  try {
    const message = await client.messages.create({
      body: "Testing Twilio connection ✅",
      from: process.env.TWILIO_PHONE,  // your Twilio number
      to: "+91XXXXXXXXXX",             // your actual phone number
    });
    console.log("Message sent successfully! SID:", message.sid);
  } catch (err) {
    console.error("Twilio Error:", err);
  }
}

test();
