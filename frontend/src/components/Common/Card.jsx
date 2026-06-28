import './Card.css';

const Card = ({ children, className = '', onClick = null }) => {
  return (
    <div className={`card ${className}`} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;
