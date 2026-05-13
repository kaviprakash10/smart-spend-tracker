import twilio from "twilio";

export const sendSMS = async (to, message) => {
  try {
    // Basic formatting for Twilio (assumes +91 for 10-digit numbers)
    const formattedTo = (to && to.length === 10) ? `+91${to}` : to;
    
    // Twilio "from" number must be exactly as provided in the Twilio Console
    const formattedFrom = process.env.TWILIO_PHONE;

    // Normalize both for comparison (remove + and spaces)
    const normalizedTo = formattedTo?.replace(/\+/g, "").trim();
    const normalizedFrom = formattedFrom?.replace(/\+/g, "").trim();

    if (normalizedTo === normalizedFrom) {
      throw new Error("The 'To' and 'From' numbers are identical (after normalization). Please use your Twilio Virtual Number in .env and your personal number in the UI.");
    }

    const sid = process.env.TWILIO_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    
    if (!sid || !sid.startsWith("AC")) {
      console.error(`ERROR: Invalid TWILIO_SID format: "${sid ? sid.substring(0, 4) + '...' : 'undefined'}"`);
      throw new Error(`SMS Service Error: Invalid TWILIO_SID format. Current value: ${sid}`);
    }

    const client = twilio(sid, token);
    
    if (!formattedFrom) {
      throw new Error("TWILIO_PHONE is not configured in .env");
    }

    await client.messages.create({
      body: message,
      from: formattedFrom,
      to: formattedTo,
    });
    console.log(`SMS sent to ${formattedTo} from ${formattedFrom}`);
  } catch (error) {
    console.error("Twilio SMS Error:", error.message);
    throw new Error(`SMS Service Error: ${error.message}`);
  }
};
