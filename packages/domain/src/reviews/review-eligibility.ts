export function canReview(bookingCompleted: boolean, alreadyReviewed: boolean): boolean {
  return bookingCompleted && !alreadyReviewed;
}
