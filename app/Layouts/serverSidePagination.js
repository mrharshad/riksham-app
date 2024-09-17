import style from "./serverSidePagination.module.css";
const serverSidePagination = ({
  Link,
  url,
  nextPage,
  previousPage,
  page,
  k,
}) => {
  return (
    <div className={style.pagination}>
      <Link
        href={`${url}?${k ? `k=${k}&` : ""}${
          page > 3 ? `page=${page - 1}` : ""
        }`}
        className={style.previous}
        style={{ visibility: previousPage ? "visible" : "hidden" }}
      >
        Previous
      </Link>

      <Link
        href={`${url}?${k ? `k=${k}&` : ""}${`page=${
          page > 1 ? Number(page) + 1 : 2
        }`}`}
        className={style.next}
        style={{
          visibility: nextPage ? "visible" : "hidden",
        }}
      >
        Next
      </Link>
    </div>
  );
};

export default serverSidePagination;
