const request = require("supertest");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const BASE_URL = `http://localhost:${process.env.PORT || 5000}`;

describe("Add Review API", () => {
  const jwtSecret = process.env.JWT_SECRET;

  const createAdminToken = () =>
    jwt.sign(
      { id: Date.now(), email: "admin@test.com", role: "admin" },
      jwtSecret,
      { expiresIn: "1h" }
    );

  const registerAndLoginUser = async () => {
    const stamp = Date.now();
    const email = `reviewuser${stamp}@gmail.com`;
    const password = "securepassword123";

    await request(BASE_URL).post("/api/user/register").send({
      username: `reviewuser${stamp}`,
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
      .field("name", `Review-Camera-${stamp}`)
      .field("brand", "Sony")
      .field("category", "Mirrorless")
      .field("description", "Mirrorless camera for review test")
      .field("rentalPrice", "1500")
      .field("stock", "4")
      .attach("thumbnail", Buffer.from("fake-image-content"), "thumb.jpg");
  };

  it("should fail add review when auth token is missing", async () => {
    const res = await request(BASE_URL).post("/api/review/createreview").send({
      product_id: 1,
      rating: 5,
      comment: "Great product",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Authorization token missing");
  });

  it("should fail add review when required fields are missing", async () => {
    const { token } = await registerAndLoginUser();

    const res = await request(BASE_URL)
      .post("/api/review/createreview")
      .set("Authorization", `Bearer ${token}`)
      .send({
        comment: "Missing required fields",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Product ID and rating are required");
  });

  it("should fail add review when rating is out of range", async () => {
    const { token } = await registerAndLoginUser();
    const productRes = await addProductAsAdmin();

    expect(productRes.statusCode).toBe(201);
    expect(productRes.body.success).toBe(true);

    const productId = productRes.body?.product?.id;

    const res = await request(BASE_URL)
      .post("/api/review/createreview")
      .set("Authorization", `Bearer ${token}`)
      .send({
        product_id: productId,
        rating: 6,
        comment: "Invalid rating",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Rating must be between 1 and 5");
  });

  it("should add review successfully", async () => {
    const { token } = await registerAndLoginUser();
    const productRes = await addProductAsAdmin();

    expect(productRes.statusCode).toBe(201);
    expect(productRes.body.success).toBe(true);

    const productId = productRes.body?.product?.id;

    const res = await request(BASE_URL)
      .post("/api/review/createreview")
      .set("Authorization", `Bearer ${token}`)
      .send({
        product_id: productId,
        rating: 5,
        comment: "Excellent camera",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Review created successfully");
    expect(res.body.review).toBeDefined();
    expect(res.body.review.product_id).toBe(productId);
    expect(res.body.review.rating).toBe(5);
    expect(res.body.review.comment).toBe("Excellent camera");
  });

  it("should fail when the same user reviews the same product again", async () => {
    const { token } = await registerAndLoginUser();
    const productRes = await addProductAsAdmin();

    expect(productRes.statusCode).toBe(201);
    expect(productRes.body.success).toBe(true);

    const productId = productRes.body?.product?.id;

    const firstRes = await request(BASE_URL)
      .post("/api/review/createreview")
      .set("Authorization", `Bearer ${token}`)
      .send({
        product_id: productId,
        rating: 4,
        comment: "First review",
      });

    expect(firstRes.statusCode).toBe(201);
    expect(firstRes.body.success).toBe(true);

    const secondRes = await request(BASE_URL)
      .post("/api/review/createreview")
      .set("Authorization", `Bearer ${token}`)
      .send({
        product_id: productId,
        rating: 5,
        comment: "Second review",
      });

    expect(secondRes.statusCode).toBe(409);
    expect(secondRes.body.success).toBe(false);
    expect(secondRes.body.message).toBe("You have already reviewed this product");
  });
});
