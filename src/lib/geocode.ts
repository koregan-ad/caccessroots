type GeocodeResult = {
  formatted: string;
  longitude: number;
  latitude: number;
};

export async function geocodeAddress(
  address: string
): Promise<GeocodeResult | null> {
  const token = process.env.NEXT_MAPBOX_TOKEN;

  if (!token) {
    console.error("NEXT_MAPBOX_TOKEN is missing");
    return null;
  }

  const url =
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      address
    )}.json?access_token=${token}&limit=1`;

  try {
    const response = await fetch(url, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(
        "Mapbox geocoding request failed:",
        response.status,
        response.statusText
      );
      return null;
    }

    const data = await response.json();
    const feature = data?.features?.[0];

    if (!feature) {
      console.error("Mapbox returned no results");
      return null;
    }

    const [longitude, latitude] = feature.center;

    return {
      formatted: feature.place_name || address,
      longitude,
      latitude,
    };
  } catch (error) {
    console.error("Mapbox geocoding error:", error);
    return null;
  }
}
