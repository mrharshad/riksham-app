import React, { Fragment } from "react";
import style from "./product.module.css";
import { notFound } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import Image from "next/image";
const SingleProduct = async ({ params, searchParams }) => {
  const ButtonsComponent = dynamic(() => import("./ButtonsComponent"), {
    ssr: false,
  });
  const { k, _id } = searchParams;
  let result;
  console.log("PROTOCOL_AND_HOST", process.env.PROTOCOL_AND_HOST);

  const request = await fetch(
    `${process.env.PROTOCOL_AND_HOST}/api/product/single-p/${_id}`,
    { cache: "no-cache" }
    // { next: { revalidate: 21600 } }
  );
  result = (await request.json()).data;

  if (!result) {
    notFound();
  }

  const {
    name,
    rating,
    sold,
    rInP,
    buyers,
    tOfP,
    payType,
    description,
    imgSetPD,
    imageSetD,
    keyValueD,
    aInfo,
    certificate,
    tOfDelivery,
    des1,
    des2,
    des3,
    ...clientData
  } = result;

  const [one, two, three, four, five] = rInP;
  const keyValueElement = (data) => {
    const element = [];
    const loop = data.length;
    for (let key = 0; key < loop; ) {
      element.push(
        <div className={style.keyValue} key={key}>
          <p className={style.key}>{data[key]}</p>
          <p className={style.value}>{data[key + 1]}</p>
        </div>
      );
      key = key + 2;
    }
    return element;
  };
  const ratingElement = (star, per) => {
    return (
      <p>
        {star} Star{" "}
        <span
          style={{
            boxShadow: `inset ${per * 1.2}px 0px 0px 0px green`,
          }}
        ></span>
        {per}%
      </p>
    );
  };
  return (
    <Fragment>
      <section id="productUser" className={style.section}>
        <h1>{name}</h1>
        <div className={style.firstDiv}>
          <div className={style.ratingReviews}>
            <p className={style.review}>Sold: {sold}</p>
            <p className={style.rating}>
              ★ ★ ★ ★ ★
              <span style={{ width: `${rating * 20.2}%` }}>★ ★ ★ ★ ★</span>
            </p>
          </div>
          {!imgSetPD && imageSetD && (
            <p className={style.priceSame}>
              Price of all
              <span> {imageSetD}</span> is same
            </p>
          )}
        </div>
        <ButtonsComponent
          imageSetD={imageSetD}
          tOfP={tOfP}
          Link={Link}
          clientData={clientData}
        />

        <div className={style.productInfo}>
          <p className={style.productInfoText}>Product Information</p>

          {keyValueElement(keyValueD)}

          <div className={style.description}>
            {description.map((data, index) => (
              <p className={style.nonKey} key={index}>
                {data}
              </p>
            ))}
          </div>
          <input
            type="checkbox"
            name="additionInfo"
            id="additionInfo"
            className={style.additionButton}
          />
          <label className={style.additionLabel} htmlFor="additionInfo">
            Addition Information
          </label>
          <div className={style.additionDiv}>
            {keyValueElement(aInfo)}{" "}
            {certificate.map(({ cN, cImages }) => (
              <div className={style.certificate} key={cN}>
                <p>{cN}</p>
                {cImages.map((url) => (
                  <Image
                    alt="certificate"
                    width={200}
                    height={100}
                    key={`${cN}:${url}`}
                    src={url}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className={style.reviewContainer}>
          <h5 className={style.reviewsHeading}>
            Reviews from people who have bought
          </h5>
          {sold > 0 ? (
            <div className={style.ratingInPercent}>
              <span
                style={{
                  color: rating > 3.9 ? "green" : rating > 2.5 ? "gold" : "red",
                }}
              >
                {rating} ★
              </span>
              {ratingElement(5, five)}
              {ratingElement(4, four)}
              {ratingElement(3, three)}
              {ratingElement(2, two)}
              {ratingElement(1, one)}
            </div>
          ) : (
            <p className={style.noReviews}>No Reviews</p>
          )}
          <div className={style.reviews}>
            {buyers.map(({ _id, bN, bR, bD, bS, bC, dDate }) => (
              <div key={_id} className={style.review}>
                <p className={style.name}>{bN}</p>
                <p className={style.star}>
                  <span
                    style={{
                      width: `${bR * 20}%`,
                      color: bR ? "gold" : "gray",
                    }}
                  >
                    ★ ★ ★ ★ ★
                  </span>
                </p>
                <p className={style.reviewCreated}>{dDate}</p>
                <p className={style.comment}>
                  ({`${bD} :`} {bS}) : {bC}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Fragment>
  );
};

export default SingleProduct;
