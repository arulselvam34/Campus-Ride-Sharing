import React from 'react';

const RatingsList = ({ ratings }) => {
    return (
        <div className="ratings-list">
            <h2>Ratings & Feedback</h2>
            {ratings.length === 0 ? (
                <p>No ratings available.</p>
            ) : (
                <ul>
                    {ratings.map((rating) => (
                        <li key={rating.id}>
                            <strong>{rating.user}</strong>: {rating.comment} - <em>{rating.score} stars</em>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default RatingsList;