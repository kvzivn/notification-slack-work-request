import { Client, Databases, Messaging, ID } from "node-appwrite"
import axios from "axios"

export default async ({ req, res, log, error }) => {
  const {
    stakeholderId,
    industry,
    goal,
    budget,
    timeFrame,
    skill,
    contactPreference,
    contactInfo,
  } = req.body
  const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL

  try {
    const client = new Client()
    client
      .setEndpoint("https://appwrite.teamspark.xyz/v1")
      .setProject("spark-net-app")
      .setKey(process.env.APPWRITE_API_KEY)

    const databases = new Databases(client)
    const messaging = new Messaging(client)

    const { firstName, lastName, email, accountId } =
      await databases.getDocument(
        process.env.APPWRITE_DATABASE_ID,
        process.env.APPWRITE_STAKEHOLDER_COLLECTION_ID,
        stakeholderId
      )

    log(`stakeholderId: ${stakeholderId}`)
    log(`industry: ${industry}`)
    log(`goal: ${goal}`)
    log(`budget: ${budget}`)
    log(`timeFrame: ${timeFrame}`)
    log(`skill: ${skill}`)
    log(`contactPreference: ${contactPreference}`)
    log(`contactInfo: ${contactInfo}`)
    log(`firstName: ${firstName}`)
    log(`lastName: ${lastName}`)
    log(`email: ${email}`)
    log(`accountId: ${accountId}`)

    const message = `We have a new work request!\n- First name: ${firstName}\n- Last name: ${lastName}\n- Email: ${email}${
      industry ? `\n- Industry: ${industry}` : ""
    }${goal ? `\n- Goal: ${goal}` : ""}
    ${budget ? `\n- Budget: ${budget}` : ""}${
      contactPreference ? `\n- Contact preference: ${contactPreference}` : ""
    }${contactInfo ? `\n- Contact info: ${contactInfo}` : ""}`

    await messaging.createEmail(
      ID.unique(),
      "TeamSpark Project Request",
      `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>TeamSpark</title>
    <style>
      .header {
        max-width: 570px;
        margin: 0 auto;
        padding: 20px;
      }
      .header img {
        max-width: 100%;
        height: auto;
        margin: 0;
        padding: 0;
        border-radius: 8px;
      }
      .content {
        max-width: 570px;
        margin: 0 auto;
        padding: 0 20px 10px;
        font-family: Inter, "San Francisco", Helvetica, Arial, sans-serif;
        font-size: 15px;
        line-height: 1.6;
        color: #544a43;
      }
      .footer {
        max-width: 570px;
        margin: 0 auto;
        padding: 0 20px 20px;
        font-family: Inter, "San Francisco", Helvetica, Arial, sans-serif;
        font-size: 15px;
        line-height: 1.6;
        color: #544a43;
      }
      .footer img {
        max-width: 100%;
        height: auto;
        margin: 0;
        padding: 0;
      }
    </style>
  </head>
  <body>
    <div class="header">
      <img
        src="https://cloud.appwrite.io/v1/storage/buckets/65dc899a9a558155ff9b/files/66b4ba630016ec477040/view?project=spark-net-app"
        alt="teamspark"
      />
    </div>
    <div class="content">
      <p>
        Thank you for requesting a project with TeamSpark!
      </p>
      <p>Here are the details you provided:</p>
    <ul>
        <li><strong>Industry:</strong> ${industry}</li>
        <li><strong>Goal:</strong> ${goal}</li>
        <li><strong>Skills needed:</strong> ${skill}</li>
        <li><strong>Budget:</strong> ${budget}</li>
        <li><strong>When:</strong> ${timeFrame}</li>
    </ul>

    <p>We will review your request and get back to you as soon as possible.</p>

    <p>If you have any questions or need to make changes to your request, don't hesitate to contact us.</p>

    </div>

    <div class="footer">
      <p>Jason Goodman<br />Founder & CEO</p>
      <p>
        <img
          src="https://cloud.appwrite.io/v1/storage/buckets/65dc899a9a558155ff9b/files/66b4be6200076caec304/view?project=spark-net-app"
          width="90"
          alt="jason"
        />
      </p>
      <p>
        <a
          href="https://x.com/jgoodspark"
          target="_blank"
          style="
            display: block;
            width: fit-content;
            color: #d34c1f;
            text-decoration: underline;
            margin: 0;
            padding: 0;
          "
          >@jgoodspark</a
        >
        <a
          href="https://teamspark.xyz"
          target="_blank"
          style="
            display: block;
            width: fit-content;
            color: #d34c1f;
            text-decoration: underline;
            margin: 0;
            padding: 0;
          "
          >teamspark.xyz</a
        >
      </p>
    </div>
  </body>
</html>`, // content
      [], // topics (optional)
      [accountId], // users (optional)
      [], // targets (optional)
      [], // cc (optional)
      [], // bcc (optional)
      [], // attachments (optional)
      false, // draft (optional)
      true // html (optional)
    )

    // await axios.post(slackWebhookUrl, {
    //   text: message,
    // })
  } catch (e) {
    error("Failed to send message: " + e.message)
    return res.send("Failed to send message")
  }

  return res.empty()
}
