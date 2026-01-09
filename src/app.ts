import express, { Application, Request, Response } from "express";
import cors from "cors";
import router from "./app/routes";
import notFound from "./app/middleware/notFound";
import cookieParser from "cookie-parser";
import config from "./config";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import path from "path";

const app: Application = express();
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:3000", process.env.FRONTEND_URL || config.frontend_url],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Origin", "Accept"],
  })
);

app.options('*', cors());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api/v1", router);
app.disable("etag");

app.get("/", (req: Request, res: Response) => {
  res.send({
    Message: "Server is running...",
  });
});

app.use(notFound);

app.use(globalErrorHandler);

export default app;
