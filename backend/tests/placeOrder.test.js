const request = require("supertest");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const BASE_URL = `http://localhost:${process.env.PORT || 5000}`;

describe("Place Order API", () => {
  const jwtSecret = process.env.JWT_SECRET;

  const createAdminToken = () =>
    jwt.sign(
      { id: Date.now(), email: "admin@test.com", role: "admin" },
      jwtSecret,
      { expiresIn: "1h" }
    );

  const registerAndLoginUser = async () => {
    const stamp = Date.now();
    const email = `orderuser${stamp}@gmail.com`;
    const password = "securepassword123";

    await request(BASE_URL).post("/api/user/register").send({
      username: `orderuser${stamp}`,
      email,
      password,
      confirmPassword: password,
      phoneNumber: `98${String(stamp).slice(-8)}`,
    });

    const loginRes = await request(BASE_URL).post("/api/user/login").send({
      email,
      password,
    });

    return {
      token: loginRes.body.token,
      email,
    };
  };

  const addProductAsAdmin = async () => {
    const token = createAdminToken();
    const stamp = Date.now();
    const name = `Order-Camera-${stamp}`;

    const res = await request(BASE_URL)
      .post("/api/products/addproduct")
      .set("Authorization", `Bearer ${token}`)
      .field("name", name)
      .field("brand", "Sony")
      .field("category", "Mirrorless")
      .field("description", "Mirrorless camera for order test")
      .field("rentalPrice", "1500")
      .field("stock", "4")
      .attach("thumbnail", Buffer.from("fake-image-content"), "thumb.jpg");

    return res;
  };

  it("should fail place order when auth token is missing", async () => {
    const res = await request(BASE_URL).post("/api/order/place").send({
      fullName: "Test User",
      phone: "9800000000",
      address: "Kathmandu",
      city: "Kathmandu",
      payment_method: "Cash on Delivery",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Authorization token missing");
  });

  it("should fail place order when cart is empty", async () => {
    const { token } = await registerAndLoginUser();

    const res = await request(BASE_URL)
      .post("/api/order/place")
      .set("Authorization", `Bearer ${token}`)
      .send({
        fullName: "Empty Cart User",
        phone: "9800000001",
        address: "Lalitpur",
        city: "Lalitpur",
        payment_method: "Cash on Delivery",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Your cart is empty!");
  });

  it("should place order successfully when cart has items", async () => {
    const { token } = await registerAndLoginUser();
    const productRes = await addProductAsAdmin();
    expect(productRes.statusCode).toBe(201);
    expect(productRes.body.success).toBe(true);
    const productId = productRes.body?.product?.id;

    const addCartRes = await request(BASE_URL)
      .post("/api/cart/add")
      .set("Authorization", `Bearer ${token}`)
      .send({ productId, quantity: 1 });

    expect(addCartRes.statusCode).toBe(200);
    expect(addCartRes.body.success).toBe(true);

    const orderRes = await request(BASE_URL)
      .post("/api/order/place")
      .set("Authorization", `Bearer ${token}`)
      .send({
        fullName: "Order User",
        phone: "9800000002",
        address: "Bhaktapur",
        city: "Bhaktapur",
        payment_method: "Cash on Delivery",
      });

    expect(orderRes.statusCode).toBe(201);
    expect(orderRes.body.success).toBe(true);
    expect(orderRes.body.message).toBe("Order placed successfully!");
    expect(orderRes.body.order).toBeDefined();
    expect(orderRes.body.shipping).toBeDefined();
    expect(orderRes.body.order.order_items.length).toBeGreaterThan(0);
  });
});
