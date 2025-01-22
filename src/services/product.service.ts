import { PutObjectCommand } from "@aws-sdk/client-s3";
import prisma from "../lib/prisma";
import { stripe } from "../lib/strapi";
import {
  ProductImageRequest,
  ProductRequest,
  UpdateProductRequest,
} from "../zod/product.zod";
import s3Client from "../lib/s3Client";

const bucket = process.env.AWS_BUCKET;
const awsEndpoint = process.env.AWS_ENDPOINT;

export async function getProducts() {
  return prisma.product.findMany();
}

export async function getProduct({ id }: { id: string }) {
  return prisma.product.findFirst({
    where: { id },
  });
}

export async function updateProduct({
  productId,
  description,
  name,
  price,
  quantity,
}: UpdateProductRequest & { productId: string }) {
  const product = await prisma.product.update({
    data: { name, description, price, quantity },
    where: { id: productId },
  });

  const stripeProduct = await stripe.products.update(product.id, {
    name,
    description,
  });

  if (price && stripeProduct.default_price) {
    const newStrapiPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: price * 100,
      currency: "myr",
    });

    await stripe.products.update(product.id, {
      default_price: newStrapiPrice.id,
    });

    await stripe.prices.update(`${stripeProduct.default_price}`, {
      active: false,
    });
  }

  return product;
}

export async function uploadImage({ images }: ProductImageRequest) {
  const uploadFile = async (image: File) => {
    const fileContent = new Uint8Array(await image.arrayBuffer());
    const fileKey = `products/${Date.now()}_${image.name}`;

    const params = {
      Body: fileContent,
      Bucket: bucket,
      ContentType: image.type,
      Key: fileKey,
    };

    await s3Client.send(new PutObjectCommand(params));

    return `${awsEndpoint}/${bucket}/${fileKey}`;
  };

  return Promise.all(images.map(uploadFile));
}

export async function deleteProduct({ id }: { id: string }) {
  await stripe.products.update(id, {
    active: false,
  });

  const prices = await stripe.prices.list({ product: id });

  await Promise.all(
    prices.data.map((price) =>
      stripe.prices.update(price.id, { active: false })
    )
  );

  await prisma.product.delete({
    where: { id },
  });
}

export async function createProduct({
  name,
  description,
  price,
  quantity,
  userId,
  image,
}: ProductRequest & { userId: string }) {
  const company = await prisma.company.findFirstOrThrow({
    where: { userId },
    select: { id: true },
  });

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price,
      quantity,
      image: {
        create: image.map((d) => ({ url: d })),
      },
      company: {
        connect: { ...company },
      },
    },
    include: { image: true },
  });

  await stripe.products.create({
    id: product.id,
    name,
    description,
    default_price_data: {
      currency: "myr",
      unit_amount: price * 100,
    },
  });

  return product;
}
