export function isCatalogReady(catalog) {
  return Boolean(catalog && Array.isArray(catalog.properties) && catalog.properties.length > 0);
}

function toStableSerializable(value) {
  if (Array.isArray(value)) {
    return value.map((item) => {
      if (item === undefined || typeof item === "function" || typeof item === "symbol") {
        return null;
      }

      return toStableSerializable(item);
    });
  }

  if (value && typeof value === "object") {
    const stableObject = {};
    const keys = Object.keys(value).sort((left, right) => left.localeCompare(right));

    keys.forEach((key) => {
      const fieldValue = value[key];

      if (fieldValue === undefined || typeof fieldValue === "function" || typeof fieldValue === "symbol") {
        return;
      }

      stableObject[key] = toStableSerializable(fieldValue);
    });

    return stableObject;
  }

  if (typeof value === "number" && !Number.isFinite(value)) {
    return null;
  }

  if (typeof value === "bigint") {
    return value.toString();
  }

  return value;
}

export function catalogSignature(catalog) {
  const source = catalog && typeof catalog === "object" ? catalog : null;
  return JSON.stringify(toStableSerializable(source));
}

export function resolveInitialPropertyIndex(catalog) {
  const searchParams = new URLSearchParams(window.location.search);
  const rawTarget = searchParams.get("property") || searchParams.get("inmueble") || searchParams.get("slug") || window.location.hash.replace(/^#/, "");
  const target = String(rawTarget || "").trim().toLowerCase();

  if (!target) {
    return 0;
  }

  const matchingIndex = catalog.properties.findIndex((property) => String(property.id || "").trim().toLowerCase() === target);

  return matchingIndex >= 0 ? matchingIndex : 0;
}

export function buildPropertyUrl(property, siteBaseUrl) {
  if (property && property.publishedUrl) {
    try {
      const fallbackBase = String(siteBaseUrl || "").trim() ? new URL(siteBaseUrl, window.location.href) : new URL(window.location.href);
      const resolvedUrl = new URL(String(property.publishedUrl), fallbackBase);

      if (["http:", "https:"].includes(resolvedUrl.protocol)) {
        return resolvedUrl.toString();
      }
    } catch {
      // If resolution fails, fall back to the default site URL logic below.
    }
  }

  const configuredBase = String(siteBaseUrl || "").trim();
  const baseUrl = configuredBase ? new URL(configuredBase, window.location.href) : new URL(window.location.href);

  baseUrl.search = "";
  baseUrl.hash = "";
  baseUrl.searchParams.set("property", property.id);

  return baseUrl.toString();
}

export function buildQrUrl(property, siteBaseUrl) {
  const propertyUrl = buildPropertyUrl(property, siteBaseUrl);
  return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=10&data=${encodeURIComponent(propertyUrl)}`;
}
