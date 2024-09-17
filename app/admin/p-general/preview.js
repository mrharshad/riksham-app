import React from "react";
import styles from "./preview.module.css";
const Preview = ({ data, Image, openDesign }) => {
  const {
    name = "please enter name",
    des1,
    des2,
    des3,
    thumbnail,
  } = data || {};

  return (
    <div id={styles.single} className={styles[openDesign]}>
      <div className={styles.ratingReviews}>
        <p className={styles.review}>Sold: 1000</p>
        <p className={styles.rating}>★ ★ ★ ★ ★</p>
      </div>

      <p className={styles.name}>{name}</p>
      <div className={styles.imgCover}>
        {thumbnail?.thumbUrl ? (
          <Image
            className={styles.img}
            src={thumbnail.thumbUrl}
            height={20}
            width={200}
            alt="product image"
          />
        ) : (
          <p className={styles.img}></p>
        )}
      </div>

      <div className={styles.priceDiv}>
        <p className={styles.charges}>
          <span>Free Shipping</span>
          <span>Free Packaging</span>
        </p>

        <p className={styles.currentPrice}>
          <span>₹</span>
          15'999
        </p>

        <p className={styles.mrp}>
          M.R.P: ₹<span>19'999</span>
        </p>
        <p className={styles.discount}>23% Off</p>
      </div>

      <div className={styles.options}>
        {!des1 ? (
          <p className={styles.priceSame}>
            Price is same for all
            <span> Colour</span> & <span>Variant</span>!
          </p>
        ) : (
          <p>{des1}</p>
        )}
        <p>{des2}</p>
        <p>{des3}</p>
      </div>
    </div>
  );
};

export default Preview;
