import React from "react";
import style from "./certificate.module.css";
import { changeDateKey } from "@/app/redux/slice/manager";
const Certificates = ({
  useState,
  certificate,
  Image,
  useRef,
  dispatch,
  requiredCertificate,
}) => {
  const numOfCertificate = certificate.length;
  const [openIndex, setOpenIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const { cN, cImages } = certificate[openIndex] || {};
  const linkInput = useRef();
  const certificateName = useRef();
  const numOfImages = cImages?.length;
  const openIndexFunc = (index) => {
    setLoading(true);
    setOpenIndex(index);
    setTimeout(() => {
      setLoading(false);
    }, 50);
  };
  function capitalizeWords(str) {
    return str.replace(/\b\w/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }
  const addNewCertificate = () => {
    let value = certificateName.current.value.trim();
    value = value.toLowerCase();

    if (!value) {
      return alert("please enter certificate name");
    }

    const allNames = certificate.some((data) => data.cN.toLowerCase() == value);
    if (allNames) {
      return alert("This certificate already exists");
    }
    let copyData = JSON.parse(JSON.stringify(certificate));
    value = capitalizeWords(value);
    copyData.push({ cN: value, cImages: [] });

    dispatch(changeDateKey({ name: "certificate", value: copyData }));
    certificateName.current.value = "";
  };
  const addLink = () => {
    setLoading(true);
    const value = linkInput.current.value.trim();
    let copyData = JSON.parse(JSON.stringify(certificate));
    try {
      if (!value) {
        throw new Error("please enter certificate image link");
      }
      const acceptDomain = "https://res.cloudinary.com/duxuhsx8x/image/upload/";

      const newImgDomain = value.slice(0, acceptDomain.length);

      if (acceptDomain !== newImgDomain) {
        throw new Error("Please check image link address");
      }

      const allLinks = [];
      for (let data of copyData) {
        allLinks.push(...data.cImages);
      }
      if (allLinks.includes(value)) {
        throw new Error("This certificate already exists");
      }

      copyData[openIndex].cImages.push(value);
    } catch (err) {
      setTimeout(() => {
        setLoading();
      }, 10);
      linkInput.current.value = "";
      return alert(err.message);
    }
    dispatch(changeDateKey({ name: "certificate", value: copyData }));
    setTimeout(() => {
      setLoading();
    }, 10);
    linkInput.current.value = "";
  };
  const moveAndDelete = (index, clicked) => {
    let copyData = [...certificate];

    if (!clicked) {
      copyData = copyData.filter(
        (data, certificateIndex) => certificateIndex !== index
      );
      const length = copyData.length;
      if (length > 0) {
        if (length < openIndex + 1) {
          setOpenIndex(openIndex - 1);
        }
      } else {
        setOpenIndex(0);
      }
    } else {
      copyData[index] =
        clicked === "bottom" ? certificate[index + 1] : certificate[index - 1];

      copyData[clicked === "bottom" ? index + 1 : index - 1] =
        certificate[index];
    }

    dispatch(changeDateKey({ name: "certificate", value: copyData }));
  };
  const editCertificate = (index, clicked) => {
    const copyData = JSON.parse(JSON.stringify(certificate));
    let newImages = [];
    if (clicked == "delete") {
      newImages = cImages.filter((data, imgIndex) => imgIndex !== index);
    } else {
      newImages = cImages.with(
        index,
        clicked === "right" ? cImages[index + 1] : cImages[index - 1]
      );
      newImages = newImages.with(
        clicked === "right" ? index + 1 : index - 1,
        cImages[index]
      );
    }
    copyData[openIndex].cImages = newImages;
    dispatch(changeDateKey({ name: "certificate", value: copyData }));
  };

  return (
    <div className={style.certificate}>
      <h4>Required Certificates Image Add</h4>
      <div className={style.names}>
        {numOfCertificate >= 10 ? null : (
          <label className={style.newCertificate}>
            Name
            <input
              ref={certificateName}
              type="text"
              placeholder="enter certificate name..."
            />
            <button onClick={addNewCertificate} type="button">
              Add
            </button>
          </label>
        )}
        {certificate.map((data, index) => {
          const { cN, cImages } = data;
          return (
            <div
              className={style.singleCer}
              style={{
                borderColor: openIndex === index ? "#0cff0c" : "white",
              }}
              key={cN}
            >
              <p
                onClick={() => {
                  openIndexFunc(index);
                }}
              >
                {" "}
                <span>{cImages.length}</span> {cN}
              </p>
              {requiredCertificate.includes(cN) ? null : (
                <svg onClick={() => moveAndDelete(index)}>
                  <path
                    fill="#FF0000"
                    d="M7 18a1 1 0 0 1-.707-1.707l10-10a1 1 0 0 1 1.414 1.414l-10 10A.997.997 0 0 1 7 18Z"
                  ></path>
                  <path
                    fill="#FF0000"
                    d="M17 18a.997.997 0 0 1-.707-.293l-10-10a1 1 0 0 1 1.414-1.414l10 10A1 1 0 0 1 17 18Z"
                  ></path>
                </svg>
              )}

              {numOfCertificate > 1 && index > 0 ? (
                <svg
                  className={style.top}
                  onClick={() => moveAndDelete(index, "top")}
                  viewBox="0 0 512 512"
                >
                  <path
                    d="m184.7 413.1 2.1-1.8 156.5-136c5.3-4.6 8.6-11.5 8.6-19.2 0-7.7-3.4-14.6-8.6-19.2L187.1 101l-2.6-2.3C182 97 179 96 175.8 96c-8.7 0-15.8 7.4-15.8 16.6v286.8c0 9.2 7.1 16.6 15.8 16.6 3.3 0 6.4-1.1 8.9-2.9z"
                    fill="#3385ff"
                  ></path>
                </svg>
              ) : null}
              {numOfCertificate > 1 && numOfCertificate > index + 1 ? (
                <svg
                  className={style.bottom}
                  onClick={() => moveAndDelete(index, "bottom")}
                  viewBox="0 0 512 512"
                >
                  <path
                    d="m184.7 413.1 2.1-1.8 156.5-136c5.3-4.6 8.6-11.5 8.6-19.2 0-7.7-3.4-14.6-8.6-19.2L187.1 101l-2.6-2.3C182 97 179 96 175.8 96c-8.7 0-15.8 7.4-15.8 16.6v286.8c0 9.2 7.1 16.6 15.8 16.6 3.3 0 6.4-1.1 8.9-2.9z"
                    fill="#3385ff"
                  ></path>
                </svg>
              ) : null}
            </div>
          );
        })}
      </div>
      {numOfCertificate ? (
        <div className={style.opened}>
          <p>
            ( {cN} ) <span>Certificate</span>
          </p>
          {loading
            ? null
            : cImages.map((url, index) => (
                <div className={style.imgDiv} key={url}>
                  {numOfImages > 1 ? (
                    <svg onClick={() => editCertificate(index, "delete")}>
                      <path
                        fill="#FF0000"
                        d="M7 18a1 1 0 0 1-.707-1.707l10-10a1 1 0 0 1 1.414 1.414l-10 10A.997.997 0 0 1 7 18Z"
                      ></path>
                      <path
                        fill="#FF0000"
                        d="M17 18a.997.997 0 0 1-.707-.293l-10-10a1 1 0 0 1 1.414-1.414l10 10A1 1 0 0 1 17 18Z"
                      ></path>
                    </svg>
                  ) : null}
                  {numOfImages > 1 && index > 0 ? (
                    <svg
                      onClick={() => editCertificate(index, "left")}
                      viewBox="0 0 512 512"
                      className={style.leftArrow}
                    >
                      <path
                        d="m327.3 98.9-2.1 1.8-156.5 136c-5.3 4.6-8.6 11.5-8.6 19.2 0 7.7 3.4 14.6 8.6 19.2L324.9 411l2.6 2.3c2.5 1.7 5.5 2.7 8.7 2.7 8.7 0 15.8-7.4 15.8-16.6V112.6c0-9.2-7.1-16.6-15.8-16.6-3.3 0-6.4 1.1-8.9 2.9z"
                        fill=" #3385ff"
                      ></path>
                    </svg>
                  ) : null}
                  {numOfImages > 1 && numOfImages > index + 1 ? (
                    <svg
                      className={style.rightArrow}
                      onClick={() => editCertificate(index, "right")}
                      viewBox="0 0 512 512"
                    >
                      <path
                        d="m184.7 413.1 2.1-1.8 156.5-136c5.3-4.6 8.6-11.5 8.6-19.2 0-7.7-3.4-14.6-8.6-19.2L187.1 101l-2.6-2.3C182 97 179 96 175.8 96c-8.7 0-15.8 7.4-15.8 16.6v286.8c0 9.2 7.1 16.6 15.8 16.6 3.3 0 6.4-1.1 8.9-2.9z"
                        fill="#3385ff"
                      ></path>
                    </svg>
                  ) : null}

                  <Image
                    width={300}
                    height={200}
                    src={url}
                    alt="certificate not load"
                  />
                </div>
              ))}
          {numOfImages > 3 ? null : (
            <div className={style.addLink}>
              <input ref={linkInput} type="text" name="imgUrl" id="imgUrl" />
              <button onClick={addLink} type="button">
                Add Link
              </button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default Certificates;
