const request = require("supertest");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const BASE_URL = `http://localhost:${process.env.PORT || 5000}`;

describe("Add Product API", () => {
  const jwtSecret = process.env.JWT_SECRET;

  const createToken = (role = "admin") =>
    jwt.sign(
      { id: Date.now(), email: `${role}@test.com`, role },
      jwtSecret,
      { expiresIn: "1h" }
    );

  const buildProductPayload = () => {
    const stamp = Date.now();
    return {
      name: `Camera-${stamp}`,
      brand: "Canon",
      category: "DSLR",
      description: "Test DSLR camera for API testing",
      rentalPrice: "1200",
      stock: "5",
      specifications: "24MP, 4K",
      includedItems: "Battery, Charger",
    };
  };

  it("should add product successfully for admin with valid data", async () => {
    const token = createToken("admin");
    const payload = buildProductPayload();

    const res = await request(BASE_URL)
      .post("/api/products/addproduct")
      .set("Authorization", `Bearer ${token}`)
      .field("name", payload.name)
      .field("brand", payload.brand)
      .field("category", payload.category)
      .field("description", payload.description)
      .field("rentalPrice", payload.rentalPrice)
      .field("stock", payload.stock)
      .field("specifications", payload.specifications)
      .field("includedItems", payload.includedItems)
      .attach("thumbnail", Buffer.from("fake-image-content"), "thumbnail.jpg");

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe(`${payload.name} has been added to the rental fleet`);
    expect(res.body.product).toBeDefined();
    expect(res.body.product.name).toBe(payload.name);
  });

  it("should fail when authorization token is missing", async () => {
    const payload = buildProductPayload();

    const res = await request(BASE_URL)
      .post("/api/products/addproduct")
      .field("name", payload.name)
      .field("brand", payload.brand)
      .field("category", payload.category)
      .field("description", payload.description)
      .field("rentalPrice", payload.rentalPrice)
      .field("stock", payload.stock)
      .attach("thumbnail", Buffer.from("fake-image-content"), "thumbnail.jpg");

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Authorization token missing");
  });

  it("should fail when logged-in user is not admin", async () => {
    const token = createToken("user");
    const payload = buildProductPayload();

    const res = await request(BASE_URL)
      .post("/api/products/addproduct")
      .set("Authorization", `Bearer ${token}`)
      .field("name", payload.name)
      .field("brand", payload.brand)
      .field("category", payload.category)
      .field("description", payload.description)
      .field("rentalPrice", payload.rentalPrice)
      .field("stock", payload.stock)
      .attach("thumbnail", Buffer.from("fake-image-content"), "thumbnail.jpg");

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Access denied: Admins only");
  });

  it("should fail when required fields are missing", async () => {
    const token = createToken("admin");

    const res = await request(BASE_URL)
      .post("/api/products/addproduct")
      .set("Authorization", `Bearer ${token}`)
      .field("name", "Incomplete Product")
      .field("description", "Missing price, stock, and thumbnail");

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe(
      "Model name, description, rental price, stock, and gear thumbnail are required"
    );
  });

  it("should fail when thumbnail file type is invalid", async () => {
    const token = createToken("admin");
    const payload = buildProductPayload();

    const res = await request(BASE_URL)
      .post("/api/products/addproduct")
      .set("Authorization", `Bearer ${token}`)
      .field("name", payload.name)
      .field("brand", payload.brand)
      .field("category", payload.category)
      .field("description", payload.description)
      .field("rentalPrice", payload.rentalPrice)
      .field("stock", payload.stock)
      .attach("thumbnail", Buffer.from("not-an-image"), "thumbnail.txt");

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Only image files are allowed");
  });
});
