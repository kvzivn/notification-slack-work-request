import { Client, Databases } from "node-appwrite"
// import axios from "axios"

export default async ({ req, res, log, error }) => {
  const { stakeholderId, goal } = req.body
  // const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL

  try {
    const client = new Client()
    client
      .setEndpoint("https://appwrite.teamspark.xyz/v1")
      .setProject("spark-net-app")
      .setKey(process.env.APPWRITE_API_KEY)

    const databases = new Databases(client)

    const { firstName, lastName, email } = await databases.getDocument(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_STAKEHOLDER_COLLECTION_ID,
      stakeholderId
    )

    const message = `We have a new work request!\n- First name: ${firstName}\n- Last name: ${lastName}\n- Email: ${email}${
      industry ? `\n- Industry: ${industry}` : ""
    }${goal ? `\n- Goal: ${goal}` : ""}${
      contactPreference ? `\n- Contact preference: ${contactPreference}` : ""
    }${contactInfo ? `\n- Contact info: ${contactInfo}` : ""}`

    log(message)
    // await axios.post(slackWebhookUrl, {
    //   text: message,
    // })
  } catch (e) {
    error("Failed to send message: " + e.message)
    return res.send("Failed to send message")
  }

  return res.empty()
}

// 6622b2fe641cdab814ff
