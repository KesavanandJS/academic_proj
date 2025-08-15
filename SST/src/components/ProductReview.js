import React, { useState } from 'react';
import './ProductReview.css';

const ProductReview = ({ productId, reviews = [], onSubmitReview }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hover, setHover] = useState(0);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating || !comment.trim()) {
      setError('Please provide a rating and a comment.');
      return;
    }
    setError('');
    onSubmitReview && onSubmitReview({ rating, comment });
    setRating(0);
    setComment('');
  };

  return (
    <div className="product-review-section">
      <h3>Product Reviews</h3>
      <form className="review-form" onSubmit={handleSubmit}>
        <div className="star-rating-input">
          {[1,2,3,4,5].map((star) => (
            <span
              key={star}
              className={`star ${hover >= star || rating >= star ? 'filled' : ''}`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              role="button"
              tabIndex={0}
              aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
            >
              ★
            </span>
          ))}
        </div>
        <textarea
          className="review-textarea"
          placeholder="Write your review..."
          value={comment}
          onChange={e => setComment(e.target.value)}
          rows={3}
        />
        {error && <div className="review-error">{error}</div>}
        <button type="submit" className="submit-review-btn">Submit Review</button>
      </form>
      <div className="reviews-list">
        {reviews.length === 0 && <div className="no-reviews">No reviews yet.</div>}
        {reviews.map((review, idx) => (
          <div className="review-item" key={idx}>
            <div className="review-rating">
              {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
            </div>
            <div className="review-comment">{review.comment}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductReview;
