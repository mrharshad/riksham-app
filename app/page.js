"use client";
import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchKeyProduct, fetchRandom } from "./redux/slice/activity";
import { visitPage, pageKeyChange } from "./redux/slice/pageHistory";

export default function Home({ searchParams }) {
  const dispatch = useDispatch();
  const [skeleton, setSkeleton] = useState([]);

  const {
    active,
    home = {},
    singlePro,
    scrollFetching,
  } = useSelector((data) => data.pageHistory);
  const { scrolled } = home || {};

  const { data, device, token } = useSelector((data) => data.user);
  const { intTofP, products, loadingA, searchPro, searchSort, search, page } =
    useSelector((data) => data.activity);
  const totalSearchPro = searchPro.length;
  const isMobile = device === "Mobile";

  const { keyName, keyPage, type } = search;

  const fetchRandomData = () => {
    dispatch(
      fetchRandom({
        page,
        intTofP,
      })
    );
  };
  const convertedURL = (text) => {
    return text.replace(/ /g, "-");
    // .replace(/[^\w-]+/g, "");
  };
  useEffect(() => {
    if (active == "home" && !keyName && page && !totalSearchPro) {
      fetchRandomData();
    }
  }, [scrollFetching]);

  useEffect(() => {
    if (
      page &&
      ((keyName && keyPage && active == "home") ||
        (keyName && keyPage && !totalSearchPro))
    ) {
      dispatch(
        fetchKeyProduct({
          keyName,
          keyPage,
          searchSort,
          type,
        })
      );
    }
  }, [scrollFetching, keyName, searchSort]);

  useEffect(() => {
    const { scrollTo } = window;
    if (scrolled >= 0) {
      dispatch(visitPage({ active: "home" }));
      scrollTo({
        top: scrolled,
        left: 0,
        behavior: "smooth",
      });
    } else {
      dispatch(
        visitPage({ name: "home", value: { scrolled: 0 }, active: "home" })
      );
      if (!keyName) {
        fetchRandomData();
      }
    }

    const demo = [];
    for (let i = 0; i < 28; i++) demo.push(i);
    setSkeleton(demo);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            dispatch(
              pageKeyChange({
                name: "scrollFetching",
                value: Math.floor(Math.random() * 1000),
              })
            );
          }
        });
      },
      {
        // root: document.querySelector("nav"),
        // rootMargin: "100px",
        // threshold: 0,
      }
    );

    const items = document.querySelector(`#loading`);
    observer.observe(items);

    return () => {
      observer.disconnect();
      // removeEventListener("scroll", scrollHandler);
      dispatch(visitPage({ active: "other" }));
    };
  }, []);

  return (
    <Fragment>
      <section id="productUser" className={styles.section}>
        <div className={styles.searchProducts}>
          {(keyName || totalSearchPro ? searchPro : products).map(
            (product, index) => {
              const {
                _id,
                name,
                des1,
                des2,
                des3,
                rating,
                sold,
                imageSetD,
                imgSetPD,
                variants,
                thumbnail,
                certificate,
              } = product;
              const { options, disOpt } = variants[0];
              const dis = disOpt[0].dis;
              const mrp = options[0].mrp;
              return (
                <Link
                  className={styles.single}
                  prefetch={false}
                  key={_id}
                  href={`/single-p/?_id=${_id}&k=${convertedURL(name)}`}
                >
                  <div className={styles.ratingReviews}>
                    <p className={styles.review}>Sold: {sold}</p>

                    <p className={styles.rating}>
                      <span style={{ width: `${rating * 20.2}%` }}>
                        ★ ★ ★ ★ ★
                      </span>
                      ★ ★ ★ ★ ★
                    </p>
                  </div>

                  <p className={styles.name}>{name}</p>
                  <div className={styles.imgCover}>
                    <Image
                      className={styles.img}
                      src={thumbnail.thumbUrl}
                      height={20}
                      width={200}
                      alt="product image"
                    />
                  </div>

                  <div className={styles.priceDiv}>
                    <p className={styles.charges}>
                      Free <span>Shipping</span>
                    </p>

                    <p className={styles.currentPrice}>
                      <span>₹</span>
                      {(dis
                        ? (mrp - mrp * (dis / 100)).toFixed()
                        : mrp
                      ).toLocaleString("en-IN")}
                    </p>
                    {dis && (
                      <>
                        <p className={styles.mrp}>
                          M.R.P: ₹<span>{mrp.toLocaleString("en-IN")}</span>
                        </p>
                        <p className={styles.discount}>{dis}% Off</p>
                      </>
                    )}
                  </div>
                  <div className={styles.options}>
                    {!imgSetPD && imageSetD ? (
                      <p className={styles.priceSame}>
                        Price of all
                        <span> {imageSetD}</span> is same
                      </p>
                    ) : (
                      <p>{des1}</p>
                    )}
                    <p>{des2}</p>
                    <p>{des3}</p>
                  </div>
                </Link>
              );
            }
          )}
          {loadingA == "key-pro" || loadingA == "random-pro" ? (
            <div id={styles.skeletonDiv} className={styles.searchProducts}>
              {skeleton.map((data, i) => {
                return (
                  <div id={styles.skeleton} key={i} className={styles.single}>
                    <div className={styles.ratingReviews}></div>
                    <p className={styles.name}></p>
                    <div className={styles.imgCover}></div>

                    <div className={styles.options}>
                      <p></p>
                      <p></p>
                      <p></p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
          {!totalSearchPro && keyName ? (
            <p className={styles.notFound}>Product Not Found</p>
          ) : null}
        </div>
        <div id="loading" className={styles.loading}></div>
      </section>
    </Fragment>
  );
}
