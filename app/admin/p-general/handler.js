import React from "react";
import Preview from "./preview";
import style from "./handler.module.css";
import {
  changeStateKey,
  dataSelect,
  draftDelete,
  draftSave,
  toggle,
} from "@/app/redux/slice/manager";
const Handler = ({ Image, dispatch, useSelector }) => {
  const { data, preview, drafts, container, openedDraft } = useSelector(
    (data) => data.manager
  );

  const { tOfP, certificate, imageSets, variants, _id, name } = data || {};
  const numOfImages = imageSets?.length || 0;
  const numOfVariants = variants?.length || 0;
  const toggleContainer = (e) => {
    const target = e.target;
    const name = target.name;
    const value = target.value;
    // if (value == "Description") {
    //   if (!data.tOfP) {
    //     return alert("please select product type");
    //   }
    // }
    dispatch(toggle({ name, value }));
  };

  const selectDraft = (e) => {
    const target = e.target;
    const value = +target.value;
    const name = target.name;

    if (name == "select") {
      dispatch(dataSelect(value));
    } else {
      dispatch(draftDelete({ storageName: "p-general", id: value }));
    }
    dispatch(toggle({ name: "container", value: "" }));
    setTimeout(() => {
      dispatch(toggle({ name: "container", value: "Type" }));
    }, 10);
  };

  return (
    <>
      <input
        className={style.firstInput}
        type="checkbox"
        name="toggleFirst"
        id="toggleFirst"
      />
      <div className={style.first}>
        {_id ? (
          <label style={style.toggleLabel} htmlFor="toggleFirst">
            Update : <span>{name}</span>
          </label>
        ) : (
          <label style={style.toggleLabel} htmlFor="toggleFirst">
            Create New Document
          </label>
        )}
        <div className={style.docBtn}>
          {container === "searchProduct" || _id ? null : (
            <button
              onClick={() => {
                dispatch(draftSave("p-general"));
              }}
              type="button"
            >
              Add Draft
            </button>
          )}
          <button onClick={selectDraft} name="select" value={0} type="button">
            New Document
          </button>

          {container === "searchProduct" ? null : (
            <button
              onClick={() => {
                dispatch(
                  changeStateKey({ name: "container", value: "searchProduct" })
                );
              }}
              type="button"
            >
              Update Document
            </button>
          )}
        </div>
        <div className={style.components}>
          <p>Write</p>
          <button
            onClick={toggleContainer}
            name="container"
            style={{
              backgroundColor:
                container === "Type" ? "white" : "lightslategray",
            }}
            value="Type"
            type="button"
          >
            Type
          </button>
          {tOfP ? (
            <button
              onClick={toggleContainer}
              name="container"
              style={{
                backgroundColor:
                  container === "Description" ? "white" : "lightslategray",
              }}
              value="Description"
              type="button"
            >
              Description
            </button>
          ) : null}
          <button
            onClick={toggleContainer}
            name="container"
            style={{
              backgroundColor:
                container === "Image" ? "white" : "lightslategray",
            }}
            value="Image"
            type="button"
          >
            Image
          </button>
          {numOfImages > 0 ? (
            <button
              onClick={toggleContainer}
              name="container"
              style={{
                backgroundColor:
                  container === "Variant" ? "white" : "lightslategray",
              }}
              value="Variant"
              type="button"
            >
              Variant
            </button>
          ) : null}
          {tOfP ? (
            <button
              onClick={toggleContainer}
              name="container"
              style={{
                backgroundColor:
                  container === "Certificate" ? "white" : "lightslategray",
              }}
              value="Certificate"
              type="button"
            >
              Certificate
            </button>
          ) : null}
          <button
            onClick={toggleContainer}
            name="container"
            style={{
              backgroundColor:
                container === "Thumbnail" ? "white" : "lightslategray",
            }}
            value="Thumbnail"
            type="button"
          >
            Thumbnail
          </button>
        </div>
        {numOfImages > 0 || numOfVariants > 0 ? (
          <div className={style.components}>
            <p>Update</p>
            {numOfImages > 0 ? (
              <button
                onClick={toggleContainer}
                name="container"
                style={{
                  backgroundColor:
                    container === "Image-Update" ? "white" : "lightslategray",
                }}
                value="Image-Update"
                type="button"
              >
                Image
              </button>
            ) : null}
            {numOfVariants > 0 ? (
              <>
                <button
                  onClick={toggleContainer}
                  name="container"
                  style={{
                    backgroundColor:
                      container === "Variant-Update"
                        ? "white"
                        : "lightslategray",
                  }}
                  value="Variant-Update"
                  type="button"
                >
                  Variant
                </button>
                <button
                  onClick={toggleContainer}
                  name="container"
                  style={{
                    backgroundColor:
                      container === "Price&Stock" ? "white" : "lightslategray",
                  }}
                  value="Price&Stock"
                  type="button"
                >
                  Price & Stock
                </button>
              </>
            ) : null}
          </div>
        ) : null}
        <div className={style.draft}>
          <p>
            Draft Saved <span>{drafts?.length || 0}</span>
          </p>
          {drafts?.map((draft) => {
            const { time, date, id, data, draftId } = draft;
            return (
              <div key={draftId}>
                <p>{data.name} </p>
                <span>{time}</span>
                <span>{date}</span>
                {draftId === openedDraft ? null : (
                  <button
                    onClick={selectDraft}
                    name="select"
                    value={draftId}
                    type="button"
                  >
                    Select
                  </button>
                )}
                <button
                  onClick={selectDraft}
                  name="delete"
                  value={draftId}
                  type="button"
                >
                  Delete
                </button>
              </div>
            );
          })}
        </div>

        <div className={style.preview}>
          <p>Preview</p>
          <button
            name="preview"
            value="mobile"
            style={{
              backgroundColor:
                preview === "mobile" ? "white" : "lightslategray",
            }}
            onClick={toggleContainer}
            type="button"
          >
            Mobile
          </button>
          <button
            name="preview"
            value="desktop"
            style={{
              backgroundColor:
                preview === "desktop" ? "white" : "lightslategray",
            }}
            onClick={toggleContainer}
            type="button"
          >
            Tab/Desktop
          </button>
        </div>
        <Preview data={data} Image={Image} openDesign={preview} />
      </div>
    </>
  );
};

export default Handler;
