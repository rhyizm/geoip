import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import * as maxmind from "maxmind";
import * as path from 'path';

const dbPath = path.resolve(__dirname, '../data/GeoLite2-City.mmdb');
if (!dbPath) {
  console.error("GeoIP database file not found.");
}

let lookup: maxmind.Reader<maxmind.CityResponse>;

// Load the database on application startup
maxmind.open<maxmind.CityResponse>(dbPath)
  .then(reader => {
    lookup = reader;
  })
  .catch(err => {
    console.error("Failed to load the GeoIP database:", err);
  });

export async function geoip(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  // Get IP address from query parameters
  const ip = request.query.get("ip");
  if (!ip) {
    return { status: 400, body: "Please specify the 'ip' query parameter." };
  }

  try {
    // Retrieve geographic information from IP address
    const geoInfo = lookup.get(ip);
    if (!geoInfo) {
      return { status: 404, body: "No geographic information found for the specified IP address." };
    }

    const country = geoInfo.country?.names?.en || "unknown";
    const city = geoInfo.city?.names?.en || "unknown";

    return {
      status: 200,
      jsonBody: {
        countryEn: country,
        cityEn: city,
        ...geoInfo
      }
    };
  } catch (err) {
    context.error(`Error occurred while looking up IP address ${ip}:`, err);
    return { status: 500, body: "An internal server error occurred." };
  }
};

// Register the function as an HTTP trigger
app.http('geoip', {
  methods: ['GET'],
  authLevel: 'function',
  handler: geoip
});
