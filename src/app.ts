import express, { Application, Request, Response } from "express";
import cors from "cors";
import router from "./app/routes";
import notFound from "./app/middleware/notFound";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import cookieParser from "cookie-parser";
import config from "./config";

const app: Application = express();

app.use(
  cors({
    origin: ["http://localhost:3000", config.frontend_url],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send({
    Message: "Server is running...",
  });
});

app.use(notFound);

app.use(globalErrorHandler);

export default app;
