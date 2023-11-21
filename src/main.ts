import * as mqtt from "mqtt";
import { env } from "./env";

const client = mqtt.connect(env.BROKER_URL, {
  username: env.BROKER_USERNAME,
  password: env.BROKER_PASSWORD,
});

const serials = ["A123", "B456", "C789"];

const fakeOperation = async (serial: string) => {
  const topic = `devices/${serial}/events`;
  while (true) {
    const operationTime = Math.floor(Math.random() * 30);
    await new Promise((resolve) => setTimeout(resolve, operationTime * 1000));
    const operationSuccess = Math.random() > 0.2;
    const message = operationSuccess
      ? "OPERATION DONE"
      : "ERROR: something went wrong";

    client.publish(topic, message, (err) => {
      if (err) console.error("Error publishing message:", err);
      else if (env.DEBUG)
        console.log(`Message published to topic "${topic}": ${message}`);
    });
  }
};

const fakeEnergy = async (serial: string) => {
  const topic = `nxt/${serial}/energy/data`;

  while (true) {
    const message = JSON.stringify({
      id: serial,
      dt: new Date().toISOString(),
      voltage: [
        Math.floor(Math.random() * 100),
        Math.floor(Math.random() * 100),
        Math.floor(Math.random() * 100),
      ],
      current: [
        Math.floor(Math.random() * 100),
        Math.floor(Math.random() * 100),
        Math.floor(Math.random() * 100),
      ],
      power: [
        Math.floor(Math.random() * 100),
        Math.floor(Math.random() * 100),
        Math.floor(Math.random() * 100),
      ],
      pf: [
        Math.floor(Math.random() * 100),
        Math.floor(Math.random() * 100),
        Math.floor(Math.random() * 100),
      ],
      total: [
        Math.floor(Math.random() * 100),
        Math.floor(Math.random() * 100),
        Math.floor(Math.random() * 100),
      ],
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    client.publish(topic, message, (err) => {
      if (err) console.error("Error publishing message:", err);
      else if (env.DEBUG)
        console.log(`Message published to topic "${topic}": ${message}`);
    });
  }
};

client.on("connect", () => {
  console.log("Connected to MQTT broker");

  serials.forEach((serial) => {
    fakeOperation(serial);
    fakeEnergy(serial);
  });
});

// Event handler for when an error occurs
client.on("error", (err) => {
  console.error("MQTT client error:", err);
});

// Event handler for when the client is disconnected
client.on("close", () => {
  console.log("Disconnected from MQTT broker");
});

// Event handler for when the client receives a message
client.on("message", (topic, message) => {
  console.log(`Received message on topic "${topic}": ${message}`);
});
