// src/ProfileCard.jsx
import React from 'react';
function ProfileCard(props) {
  const { name, title, image, description } = props;
  return (
    <div style={styles.card}>
      <img src={image} alt={`${name}'s profile`} style={styles.image} />
      <h2>{name}</h2>
      <h4>{title}</h4>
      <p>{description}</p>
    </div>
  );
}
const styles = {
  card: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    maxWidth: '300px',
    textAlign: 'center',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    fontFamily: 'Arial, sans-serif',
  },
  image: {
card: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    maxWidth: '300px',
    textAlign: 'center',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    fontFamily: 'Arial, sans-serif',
  },
  image: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: '15px',
  },
};
export default ProfileCard;