import { Client, Databases, Query } from "node-appwrite"
import axios from "axios"

export default async ({ req, res, log, error }) => {
  const { stakeholderId, goal } = JSON.parse(req.body)
  const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL

  const client = new Client()
  client
    .setEndpoint("https://appwrite.teamspark.xyz/v1")
    .setProject("spark-net-app")
    .setKey(process.env.APPWRITE_API_KEY)

  const databases = new Databases(client)

  const stakeholder = await databases.getDocument(
    process.env.APPWRITE_DATABASE_ID,
    process.env.APPWRITE_STAKEHOLDER_COLLECTION_ID,
    stakeholderId
  )

  const { name, email } = stakeholder.document

  const message = `We have a new work request!\n- Name: ${name}\n- Email: ${email}${
    goal ? `\n- Goal: ${goal}` : ""
  }`

  try {
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
