import http from "http";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 8000;
const DATA_PATH = path.join(__dirname, "data", "products.json");
const DEFAULTS_PATH = path.join(__dirname, "data", "default-products.json");

const readProducts = async () => {
  const file = await fs.readFile(DATA_PATH, "utf-8");
  return JSON.parse(file);
};

const writeProducts = async (products) => {
  await fs.writeFile(DATA_PATH, JSON.stringify(products, null, 2));
};

const sendJson = (res, status, payload) => {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
};

const getContentType = (filePath) => {
  const ext = path.extname(filePath);
  switch (ext) {
    case ".html":
      return "text/html";
    case ".css":
      return "text/css";
    case ".js":
      return "application/javascript";
    case ".json":
      return "application/json";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    default:
      return "application/octet-stream";
  }
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === "/api/products" && req.method === "GET") {
    try {
      const products = await readProducts();
      return sendJson(res, 200, products);
    } catch (error) {
      return sendJson(res, 500, { message: "Unable to load products." });
    }
  }

  if (url.pathname === "/api/products" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", async () => {
      try {
        const { name, description, image, video, category, highlight } = JSON.parse(body || "{}");
        if (!name || !description || (!image && !video)) {
          return sendJson(res, 400, { message: "Missing required fields." });
        }

        const products = await readProducts();
        const nextProduct = {
          id: `sg-${Date.now()}`,
          name,
          description,
          image: image || "",
          video: video || "",
          category: category || "General",
          highlight: highlight || "",
        };
        products.unshift(nextProduct);
        await writeProducts(products);
        return sendJson(res, 201, nextProduct);
      } catch (error) {
        return sendJson(res, 500, { message: "Unable to save product." });
      }
    });
    return;
  }

  if (url.pathname.startsWith("/api/products/") && req.method === "DELETE") {
    const id = url.pathname.split("/").pop();
    try {
      const products = await readProducts();
      const filtered = products.filter((product) => product.id !== id);
      await writeProducts(filtered);
      res.writeHead(204);
      return res.end();
    } catch (error) {
      return sendJson(res, 500, { message: "Unable to delete product." });
    }
  }

  if (url.pathname === "/api/products/reset" && req.method === "POST") {
    try {
      const defaults = await fs.readFile(DEFAULTS_PATH, "utf-8");
      await fs.writeFile(DATA_PATH, defaults);
      return sendJson(res, 200, { message: "Reset complete." });
    } catch (error) {
      return sendJson(res, 500, { message: "Unable to reset products." });
    }
  }

  const filePath = url.pathname === "/" ? "/index.html" : url.pathname;
  const resolvedPath = path.join(__dirname, filePath);

  try {
    const file = await fs.readFile(resolvedPath);
    res.writeHead(200, { "Content-Type": getContentType(resolvedPath) });
    res.end(file);
  } catch (error) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

server.listen(PORT, () => {
  console.log(`SeaGlow server running on http://localhost:${PORT}`);
});
