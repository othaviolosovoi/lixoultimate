import { Platform } from "react-native";

const LOG_SERVER_URL =
  process.env.EXPO_PUBLIC_LOG_SERVER_URL || "http://136.248.96.42:5002";

interface LogData {
  level: "info" | "warn" | "error";
  message: string;
  data?: any;
  timestamp: string;
  platform: string;
  appVersion?: string;
}

class Logger {
  private async sendLog(logData: LogData) {
    try {
      await fetch(`${LOG_SERVER_URL}/logs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(logData),
      });
    } catch (error) {
      // Fail silently - don't want logging errors to break the app
      console.error("Failed to send log:", error);
    }
  }

  private createLogData(
    level: LogData["level"],
    message: string,
    data?: any
  ): LogData {
    return {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
      platform: Platform.OS,
      appVersion: "1.0.0", // You can get this from app.json
    };
  }

  info(message: string, data?: any) {
    console.log(message, data);
    this.sendLog(this.createLogData("info", message, data));
  }

  warn(message: string, data?: any) {
    console.warn(message, data);
    this.sendLog(this.createLogData("warn", message, data));
  }

  error(message: string, data?: any) {
    console.error(message, data);
    this.sendLog(this.createLogData("error", message, data));
  }
}

export const logger = new Logger();
