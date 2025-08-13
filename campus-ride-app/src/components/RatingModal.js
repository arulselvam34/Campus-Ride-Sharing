import React, { useState } from 'react';

const RatingModal = ({ isOpen, onClose, onSubmit, driverName }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ rating, comment });
        setRating(5);
        setComment('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{
                background: 'white',
                padding: '30px',
                borderRadius: '10px',
                width: '90%',
                maxWidth: '400px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
            }}>
                <h2 style={{ margin: '0 0 20px', color: '#1e293b', textAlign: 'center' }}>
                    Rate Your Ride
                </h2>
                <p style={{ margin: '0 0 20px', color: '#64748b', textAlign: 'center' }}>
                    How was your experience with {driverName}?
                </p>
                
                <form onSubmit={handleSubmit}>
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        {[1, 2, 3, 4, 5].map(star => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '32px',
                                    color: star <= rating ? '#f59e0b' : '#e5e7eb',
                                    cursor: 'pointer',
                                    margin: '0 5px'
                                }}
                            >
                                ⭐
                            </button>
                        ))}
                    </div>
                    
                    <textarea
                        placeholder="Share your experience (optional)"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px',
                            border: '2px solid #e2e8f0',
                            borderRadius: '5px',
                            marginBottom: '20px',
                            minHeight: '80px',
                            resize: 'vertical'
                        }}
                    />
                    
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                flex: 1,
                                padding: '12px',
                                background: '#f1f5f9',
                                color: '#64748b',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            style={{
                                flex: 1,
                                padding: '12px',
                                background: '#22c55e',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontWeight: '600'
                            }}
                        >
                            Submit Rating
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RatingModal;