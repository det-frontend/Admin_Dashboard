import React from "react";

export const PrinterT = React.forwardRef(({ props }, ref) => {
  console.log(props, "jkljlkkljjlkjlkjkljkljlkjkljkljkljkljkljkljlkjkljkljklj");
  const utcTimestamp = props?.createAt;
  let hour = utcTimestamp?.slice(11, 13);
  const min = utcTimestamp?.slice(14, 16);
  const sec = utcTimestamp?.slice(17, 19);
  const year = utcTimestamp?.slice(0, 4);
  const day = utcTimestamp?.slice(5, 7);
  const month = utcTimestamp?.slice(8, 10);

  let amPm = "AM";
  if (hour >= 12) {
    amPm = "PM";
    hour -= 12;
  }
  if (hour === 0) {
    hour = 12;
  }
  return (
    <div ref={ref}>
      <div style={{ textAlign: "center" }}>
        {/* <img
          src={`data:image/jpeg;base64,${image.base64}`}
          style={{ width: "25vw", marginBottom: "5px" }}
        /> */}
        <table>
          <tr>
            <td style={{ fontWeight: "bold" }}>F.S Code</td>
            <td style={{ fontWeight: "bold" }}>F.S Code</td>
            {/* <td>: {read ? read?.station : "....."}</td> */}
          </tr>
          <tr>
            <td style={{ fontWeight: "bold" }}>Voucher</td>
            <td>: {props?.vocono}</td>
          </tr>
          <tr>
            <td style={{ fontWeight: "bold" }}>Date</td>
            <td>
              : {year}-{month}-{day} {hour}:{min}:{sec} {amPm}
            </td>
          </tr>
          <tr>
            <td style={{ fontWeight: "bold" }}>Car No.</td>
            <td>: {props?.carNo}</td>
          </tr>
          <tr>
            <td style={{ fontWeight: "bold" }}>Nozzle</td>
            <td>: {props?.nozzleNo}</td>
          </tr>
          <tr>
            <td style={{ fontWeight: "bold" }}>F.S Ph</td>
            <td style={{ fontWeight: "bold" }}>F.S Ph</td>
            {/* <td>
              : {read ? read?.ph_1 : "....."} / {read ? read?.ph_2 : "....."}
            </td> */}
          </tr>
        </table>
      </div>
      <hr />
      <div style={{ marginTop: "-5px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tr style={{ borderBottom: "0.5px dashed black" }}>
            <td style={{ padding: "10px 0px", fontWeight: "bold" }}>
              Fuel Type
            </td>
            <td colspan="2" style={{ fontWeight: "bold" }}>
              Price x Liter
            </td>
            <td style={{ textAlign: "end", fontWeight: "bold" }}>Amount</td>
          </tr>
          <tr>
            <td style={{ padding: "10px 0px" }}>{props?.fuelType}</td>
            <td>
              {props?.salePrice?.toFixed(2)} x {props?.saleLiter?.toFixed(2)}
            </td>
            <td>MMK</td>
            <td style={{ textAlign: "end" }}>
              {props?.totalPrice?.toFixed(2)}
            </td>
          </tr>
          <tr style={{ borderTop: "0.5px solid black" }}>
            <td
              style={{
                padding: "10px 0px",
                textAlign: "center",
                fontWeight: "bold",
              }}
              colspan="2"
            >
              Total (Inclusive Tax)
            </td>
            <td>MMK</td>
            <td style={{ textAlign: "end", fontWeight: "bold" }}>
              {props?.totalPrice?.toFixed(2)}
            </td>
          </tr>
        </table>
      </div>
      <div style={{ textAlign: "center", marginTop: "-18px" }}>
        <h4>Thank you. Please come again.</h4>
      </div>
    </div>
  );
});
