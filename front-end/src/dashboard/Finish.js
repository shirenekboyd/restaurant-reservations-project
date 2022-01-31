// import React from "react";
// import { useHistory } from "react-router-dom";
// import { deleteTable } from "../utils/api";

// function Finish({ table_id }) {
//   const history = useHistory();

//   async function handleClick(e) {
//     // if (
//     //   window.confirm(
//     //     "Is this table ready to seat new guests? This cannot be undone."
//     //   )
//     // ) {
//     //   const abortController = new AbortController();
//     //   await deleteTable(table_id, abortController.signal);
//     //   history.push("/");
//     //   return () => abortController.abort();
//     // }
//   }

//   return (
//     <button
//       onClick={(e) => handleClick(e)}
//       data-table-id-finish={table_id}
//       type="button"
//       className="btn btn-outline-dark"
//     >
//       Finish
//     </button>
//   );
// }

// export default Finish;
