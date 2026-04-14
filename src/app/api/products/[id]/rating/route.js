import { NextResponse } from 'next/server';

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Validate the request body
    if (!body.rating || typeof body.rating !== 'number') {
      return NextResponse.json(
        { error: 'Rating is required and must be a number' },
        { status: 400 }
      );
    }

    if (body.rating < 1 || body.rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Here you would typically update your database
    // For now, we'll just return success response
    // In a real implementation, you would:
    // 1. Connect to your database
    // 2. Update the product rating
    // 3. Maybe calculate average rating
    // 4. Return updated product data

    console.log(`Updating rating for product ${id} to ${body.rating}`);

    // Mock successful response
    return NextResponse.json({
      success: true,
      message: `Product rating updated to ${body.rating} stars`,
      productId: id,
      newRating: body.rating
    });

  } catch (error) {
    console.error('Error updating product rating:', error);
    return NextResponse.json(
      { error: 'Failed to update product rating' },
      { status: 500 }
    );
  }
}
