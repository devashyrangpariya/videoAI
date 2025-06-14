import { Connection } from "mongoose";

// Single global interface for mongoose
declare global {
  var mongoose: {
    conn: Connection | null;
    promise: Promise<Connection> | null;
  };
}

export {};
