import style from "./toastAndWait.module.css";

export function Wait() {
  return (
    <div className={style.fullSWait}>
      <div className={style.progressBar}>
        <p className={style.progressText}></p>
      </div>
    </div>
  );
}
export function UserAlert({ type, message }) {
  switch (type) {
  }
  const color =
    type == "Success" ? "green" : type == "Warning" ? "orange" : "red";

  return (
    <div className={style.UserAlert}>
      <div
        style={{
          boxShadow: `inset -2px -2px 1px 0px ${color}`,
        }}
        className={style.sos}
      >
        <span style={{ color }}>{type}</span>
        <p>{message}</p>
      </div>
    </div>
  );
}
