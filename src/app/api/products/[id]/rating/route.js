import { NextResponse } from "next/server";

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!body.rating || typeof body.rating !== "number") {
      return NextResponse.json({ error: "Rating must be a number" }, { status: 400 });
    }

    if (body.rating < 1 || body.rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      productId: id,
      updatedRating: body.rating,
      message: `Rating set to ${body.rating}`,
    });
  } catch (err) {
    console.error("Rating update error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}