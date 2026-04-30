/**
 * Structured logger for Google Cloud Logging (Cloud Run / GKE)
 * Outputs JSON logs that are automatically parsed by Cloud Logging.
 */

type LogLevel = "DEFAULT" | "DEBUG" | "INFO" | "NOTICE" | "WARNING" | "ERROR" | "CRITICAL" | "ALERT" | "EMERGENCY";

interface LogPayload {
  message: string;
  severity: LogLevel;
  [key: string]: any;
}

const log = (payload: LogPayload) => {
  // In production (Cloud Run), console.log(JSON) is the standard for structured logging
  console.log(JSON.stringify({
    ...payload,
    time: new Date().toISOString(),
  }));
};

export const logger = {
  info: (message: string, data?: object) => log({ message, severity: "INFO", ...data }),
  warn: (message: string, data?: object) => log({ message, severity: "WARNING", ...data }),
  error: (message: string, error?: any, data?: object) => log({ 
    message, 
    severity: "ERROR", 
    error: error instanceof Error ? error.message : error,
    stack: error instanceof Error ? error.stack : undefined,
    ...data 
  }),
  event: (eventName: string, data?: object) => log({ 
    message: `EVENT: ${eventName}`, 
    severity: "NOTICE", 
    event_type: eventName,
    ...data 
  }),
};
