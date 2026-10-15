export const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
        <img src={product.images?.[0]} alt={product.title} />
        <div className="product-details">
            <p>{product.title}</p>
            <p>Price: ${product.price}</p>
        </div>
    </div>
  );
}

export default ProductCard;

