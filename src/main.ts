import * as mqtt from "mqtt";
import { env } from "./env";

const client = mqtt.connect(env.BROKER_URL, {
  username: env.BROKER_USERNAME,
  password: env.BROKER_PASSWORD,
});

const topic = "data";

client.on("connect", () => {
  console.log("Connected to MQTT broker");

  // Publish a message to the specified topic
  const message = "Hello, MQTT!";
  client.publish(topic, message, (err) => {
    if (err) {
      console.error("Error publishing message:", err);
    } else {
      console.log(`Message published to topic "${topic}": ${message}`);
      // Disconnect after publishing the message
      client.end();
    }
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
