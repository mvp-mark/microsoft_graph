import express from "express";
import cors from "cors";
import { Client } from "@microsoft/microsoft-graph-client";
import cookieParser from "cookie-parser";
import axios from "axios";
import { EmailDto } from "./email.dto";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();
app.use(cors());
app.use(cookieParser());
app.get("/", async (req, res) => {
  try {
    const { code } = req.query;

    console.log("code", code);

    if (
      req.cookies.access_token === undefined ||
      req.cookies.access_token === null
    ) {
      const form = new FormData();
      form.append("client_id", "db52a000-962e-4229-bf37-083d5f2c72b6");
      form.append("scope", "User.Read, Mail.Read");
      form.append("code", code as string);
      form.append("redirect_uri", "http://localhost:3000");
      form.append("grant_type", "authorization_code");
      form.append("client_secret", "YKk8Q~byko1LT_mSmVkOc1sEGhwvHEU-zi3P7dgj");

      const response = await axios.post(
        "https://login.microsoftonline.com/consumers/oauth2/v2.0/token/",

        form,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      // save response.access_token to Cookie
      res.cookie("access_token", response.data.access_token, {
        maxAge: 1000 * 60 * 60 * 1 * 1, // 1 hour
        httpOnly: true,
      });
    }

    // const client: any = Client.init({
    //   authProvider: async (done) => {
    //     done(null, ("Bearer " + response.data.access_token) as string);
    //   },
    // });

    // const result = await client.api("/me").get;
    const result = await axios.get(
      "https://graph.microsoft.com/v1.0/me/mailFolders('inbox')/messages?$filter=isRead eq false&$select=sender,subject,body",
      {
        headers: {
          Authorization: "Bearer " + req.cookies.access_token,
        },
      }
    );

    const emails: EmailDto[] = [];
    console.log("result", result.data);
    if (result.data !== undefined && result.data.value.length > 0) {
      const email = new EmailDto();
      result.data.value.forEach((data: any) => {
        if (
          data.sender.emailAddress.address ===
          "deangelly.figueiredo@grupoicts.com.br"
        ) {
          email.area = data.subject.substring(0, 3);
          email.status = data.subject.substring(
            data.subject.length - 3,
            data.subject.length
          );
          email.serialNumber = data.body.content.substring(
            data.body.content.indexOf("JV"),
            data.body.content.indexOf("JV") + 11
          );
          email.sender = data.sender.emailAddress.address;
          emails.push(email);
          console.log("email", email);
        }
      });
    }

    emails.forEach(async (email) => {
      const savePrisma = await prisma.email.upsert({
        where: {
          Marea_Serial: {
            Marea: email.area,
            Serial: email.serialNumber,
          },
        },
        update: {
          Result: email.status,
        },
        create: {
          Marea: email.area,
          Result: email.status,
          Serial: email.serialNumber,
        },
      });
      console.log("savePrisma", savePrisma);
    });
    return res.send(emails);
  } catch (error) {
    console.log(error);

    res.send(error);
  }
  // const { code } = req.query;
  // res.send("Bearer " + code);
});

app.get("/token", async (req, res) => {
  // create params for the request
  const params = new URLSearchParams();
  params.append("client_id", "db52a000-962e-4229-bf37-083d5f2c72b6");
  params.append("scope", "User.Read, Mail.Read");
  params.append("response_type", "code");
  params.append("response_mode", "query");
  params.append("redirect_uri", "http://localhost:3000");
  params.append("grant_type", "authorization_code");
  params.append("client_secret", "YKk8Q~byko1LT_mSmVkOc1sEGhwvHEU-zi3P7dgj");

  // redirect to the login page

  return res.redirect(
    "https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize" +
      "?" +
      params.toString()
  );
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
