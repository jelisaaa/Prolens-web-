const request = require("supertest");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const BASE_URL = `http://localhost:${process.env.PORT || 5000}`;

describe("Cart API", () => {
  const jwtSecret = process.env.JWT_SECRET;

  const createAdminToken = () =>
    jwt.sign(
      { id: Date.now(), email: "admin@test.com", role: "admin" },
      jwtSecret,
      { expiresIn: "1h" }
    );

  const registerAndLoginUser = async () => {
    const stamp = Date.now();
    const email = `cartuser${stamp}@gmail.com`;
    const password = "securepassword123";

    await request(BASE_URL).post("/api/user/register").send({
      username: `cartuser${stamp}`,
      email,
      password,
      confirmPassword: password,
      phoneNumber: `98${String(stamp).slice(-8)}`,
    });

    const loginRes = await request(BASE_URL).post("/api/user/login").send({
      email,
      password,
    });

    return { token: loginRes.body.token };
  };

  const addProductAsAdmin = async () => {
    const token = createAdminToken();
    const stamp = Date.now();

    return request(BASE_URL)
      .post("/api/products/addproduct")
      .set("Authorization", `Bearer ${token}`)
      .field("name", `Cart-Camera-${stamp}`)
      .field("brand", "Sony")
      .field("category", "Mirrorless")
      .field("description", "Mirrorless camera for cart test")
      .field("rentalPrice", "1500")
      .field("stock", "4")
      .attach("thumbnail", Buffer.from("fake-image-content"), "thumb.jpg");
  };

  it("should fail add to cart when auth token is missing", async () => {
    const res = await request(BASE_URL).post("/api/cart/add").send({
      productId: 1,
      quantity: 1,
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Authorization token missing");
  });

  it("should fail add to cart when required fields are missing", async () => {
    const { token } = await registerAndLoginUser();

    const res = await request(BASE_URL)
      .post("/api/cart/add")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Product ID and quantity are required");
  });

  it("should add item to cart successfully", async () => {
    const { token } = await registerAndLoginUser();
    const productRes = await addProductAsAdmin();

    expect(productRes.statusCode).toBe(201);
    expect(productRes.body.success).toBe(true);

    const productId = productRes.body?.product?.id;

    const res = await request(BASE_URL)
      .post("/api/cart/add")
      .set("Authorization", `Bearer ${token}`)
      .send({
        productId,
        quantity: 1,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("1 item(s) added to cart");
  });

  it("should get cart items for authenticated user", async () => {
    const { token } = await registerAndLoginUser();
    const productRes = await addProductAsAdmin();
    const productId = productRes.body?.product?.id;

    await request(BASE_URL)
      .post("/api/cart/add")
      .set("Authorization", `Bearer ${token}`)
      .send({ productId, quantity: 1 });

    const res = await request(BASE_URL)
      .get("/api/cart/getCart")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.cartItems)).toBe(true);
    expect(res.body.cartItems.length).toBeGreaterThan(0);
  });

  it("should remove item from cart successfully", async () => {
    const { token } = await registerAndLoginUser();
    const productRes = await addProductAsAdmin();
    const productId = productRes.body?.product?.id;

    await request(BASE_URL)
      .post("/api/cart/add")
      .set("Authorization", `Bearer ${token}`)
      .send({ productId, quantity: 1 });

    const res = await request(BASE_URL)
      .delete(`/api/cart/remove/${productId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Item removed from cart successfully");
  });

  it("should clear cart successfully", async () => {
    const { token } = await registerAndLoginUser();
    const productRes = await addProductAsAdmin();
    const productId = productRes.body?.product?.id;

    await request(BASE_URL)
      .post("/api/cart/add")
      .set("Authorization", `Bearer ${token}`)
      .send({ productId, quantity: 1 });

    const res = await request(BASE_URL)
      .delete("/api/cart/clearcart")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Cart cleared successfully");
  });
});
