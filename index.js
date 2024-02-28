import {ExpressAdapter} from "@bull-board/express";
import {BullAdapter} from "@bull-board/api/bullAdapter.js";
import express from "express";
import dotenv from "dotenv";
import Queue from "bull"
import { createBullBoard } from "@bull-board/api";

(async () => {
  dotenv.config();
  const {REDIS_HOST, REDIS_PORT, REDIS_PASSWORD} = process.env;
  
  const redisOptions = {redis: {host: REDIS_HOST, port: REDIS_PORT, password: REDIS_PASSWORD}};
  
  // define queue
  const queueList = ["burger"];
  
  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath("/admin/queues");

  const queues = queueList.map(qs => new Queue(qs, redisOptions)).map(q => new BullAdapter(q));

  const {addQueue, removeQueue, setQueues, replaceQueues} = createBullBoard({queues, serverAdapter});

  const app = express();

  app.use("/admin/queues", serverAdapter.getRouter());

  app.listen(7000, () => {
    console.log(`Server is running on port 7000`);
    console.log("To access the dashboard, go to http://localhost:7000/admin/queues")
    console.log("Ensure Redis is running on port 6379");
  });
})()