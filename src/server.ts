import express from "express";
import cors from "cors";
import { Client } from "@microsoft/microsoft-graph-client";

const app = express();

app.use(cors());
app.get("/", async (req, res) => {
  /*try {
    const { code } = req.query;

    const client: any = Client.init({
      authProvider: async (done) => {
        done(null, ("Bearer " + code) as string);
      },
    });
    console.log(client.authProvider);
    const result = await client.api("/me").get();
    res.send(result);
  } catch (error) {
    console.log(error);

    res.send(error);
  }*/
  const { code } = req.query;
  res.send("Bearer " + code);
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
