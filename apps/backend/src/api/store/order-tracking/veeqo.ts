import { VeeqoTrackingEvent } from "./types";

const VEEQO_API_URL = "https://api.veeqo.com";

function getLatestEvent(events: VeeqoTrackingEvent[]) {
  return (
    events
      .filter((event) => event.timestamp)
      .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp))[0] ??
    null
  );
}

export async function retrieveLatestVeeqoEvent(
  shipmentId: string,
): Promise<VeeqoTrackingEvent | null> {
  const apiKey = process.env.VEEQO_API_KEY;
  if (!apiKey) {
    return null;
  }

  const response = await fetch(
    `${VEEQO_API_URL}/shipping/tracking_events/${encodeURIComponent(shipmentId)}`,
    {
      headers: {
        accept: "application/json",
        "x-api-key": apiKey,
      },
    },
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Veeqo tracking request failed: ${response.status}`);
  }

  const events = (await response.json()) as VeeqoTrackingEvent[];
  return Array.isArray(events) ? getLatestEvent(events) : null;
}
