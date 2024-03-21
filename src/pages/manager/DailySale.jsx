import React, { useContext, useEffect, useRef, useState } from "react";
import Nav from "../../components/Navbar/Nav";
import SearchButton from "../../components/SearchButton";
import SelectDrop from "../installer/SelectDrop";
import CalendarPick from "../../components/CalendarPick";
import { RiErrorWarningLine } from "react-icons/ri";
import Footer from "../../components/footer/Footer";
import { Table } from "@mantine/core";
import FilterTable from "../../components/table/FilterTable";
import UseGet from "../../api/hooks/UseGet";
import purposes from "../installer/drop_data/purposes";
import useTokenStorage from "../../utils/useDecrypt";
import fuelData from "../installer/drop_data/manager/managerFuel";
import nozzleData from "../installer/drop_data/manager/nozzle";
import { useDownloadExcel } from "react-export-table-to-excel";
import { DownloadTableExcel } from "react-export-table-to-excel";
import Button from "../../components/footer/Button";
import { RiFileExcel2Fill } from "react-icons/ri";
import { IoPrintSharp } from "react-icons/io5";
import { downloadExcel } from "react-export-table-to-excel";
import { useReactToPrint } from "react-to-print";
import Re from "../../services/Re";
import { FaPrint } from "react-icons/fa6";
import { PrinterT } from "./PrinterT";
import ErrorAlert from "../../components/alert/ErrorAlert";

const DailySale = () => {
  let start = new Date();
  start.setHours(0);
  start.setMinutes(0);
  start = new Date(start);

  let end = new Date();
  end.setHours(23);
  end.setMinutes(59);
  end = new Date(end);

  const [token, setToken] = useState("none");
  const { loadToken } = useTokenStorage();
  useEffect(() => {
    const token = loadToken();
    if (token) {
      setToken(token);
    }
  }, []);

  const [isData, setIsData] = useState(false);

  const [sDate, setSDate] = useState(start);
  const [eDate, setEDate] = useState(end);
  const [fuelType, setFuelType] = useState();
  const [pData, setPData] = useState();
  const [purposeUse, setPurposeUse] = useState();
  const [noz, setNoz] = useState();

  const { reFresh, setReFresh } = useContext(Re);

  const purposeRoute = purposeUse?.value
    ? `&vehicleType=${purposeUse?.value}`
    : "";
  const fuelRoute = fuelType?.value ? `&fuelType=${fuelType?.value}` : "";
  const nozzleRoute = noz?.value ? `&nozzleNo=${noz?.value}` : "";

  const route = `detail-sale/pagi/by-date/1?sDate=${sDate}&eDate=${eDate}${purposeRoute}${fuelRoute}${nozzleRoute}`;
  const [{ data_g, loading_g, error_g, pagi_g }, fetchItGet] = UseGet();
  const [con, setCon] = useState(false);

  useEffect(() => {
    setCon(true);
  }, []);

  useEffect(() => {
    fetchItGet(`detail-sale/pagi/by-date/1?sDate=${start}&eDate=${end}`, token);
    console.log("hello");
  }, [con, reFresh]);

  console.log(pData, "dddddddddddddddd");

  useEffect(() => {
    if (data_g?.length > 0) {
      setIsData(true);
    } else {
      setIsData(false);
    }
  }, [data_g, loading_g, error_g, fetchItGet]);

  // console.log(totalPages);

  useEffect(() => {
    if (pData) {
      // thermalPrint();
      infoData ? thermalPrint() : ErrorAlert("Station Info are Empty");
    }
  }, [pData]);

  const componentRef = useRef();
  const thermalPrint = () => {
    if (pData) {
      if (infoData) {
        const content = componentRef.current.innerHTML;
        const printWindow = window.open("", "_blank");
        printWindow.document.write(content);
        printWindow.document.close();
        printWindow.print();
        printWindow.close();
      } else {
        ErrorAlert("Some Station Info are Empty");
      }
    }
  };

  // const thermalPrint = useReactToPrint({
  //   content: () => componentRef.current,
  // });

  const infoData = JSON.parse(localStorage.getItem("data"));

  const tableHeader = [
    "Vocno",
    "Sale Date",
    "Vehicle No",
    "Purpose",
    "Nozzle",
    "Fuel",
    "Sale Gallon",
    "Sale Liter",
    "Sale Price",
    "Total Price",
    "Totallizer liter",
    "Totallizer Amount",
    "Action",
  ];

  console.log(data_g, "....");
  const tableRow = data_g?.map((element) => (
    <Table.Tr key={element.no} className=" duration-150 text-sm text-center">
      <Table.Td className="select-none">{element.vocono}</Table.Td>
      <Table.Td className="select-none">{element.createAt.slice(0,10)}</Table.Td>
      <Table.Td className="select-none">{element.carNo}</Table.Td>
      <Table.Td className="select-none">{element.vehicleType}</Table.Td>
      <Table.Td className="select-none">{element.nozzleNo}</Table.Td>
      <Table.Td className="select-none">{element.fuelType}</Table.Td>
      <Table.Td className="select-none">
        {(parseFloat(element?.saleLiter) / 4.16).toFixed(3)}
      </Table.Td>
      <Table.Td className="select-none">{element.saleLiter}</Table.Td>
      <Table.Td className="select-none">
        {element.salePrice.toFixed(2).toLocaleString(undefined, {
          maximumFractionDigits: 3,
        })}
      </Table.Td>
      <Table.Td className="select-none">
        {element.totalPrice.toFixed(2).toLocaleString(undefined, {
          maximumFractionDigits: 3,
        })}
      </Table.Td>
      <Table.Td className="select-none">
        {element.totalizer_liter.toFixed(3)}
      </Table.Td>
      <Table.Td className="select-none">
        {element.totalizer_amount.toFixed(2).toLocaleString(undefined, {
          maximumFractionDigits: 3,
        })}
      </Table.Td>
      <Table.Td className="">
        <div
          // onClick={thermalPrint}
          onClick={() => {
            setPData(element);
            thermalPrint();
          }}
          className="bg-detail active:scale-90 duration-75 cursor-pointer flex py-3 rounded justify-center "
        >
          <FaPrint className="text-2xl text-secondary" />
        </div>
      </Table.Td>
    </Table.Tr>
  ));

  // console.log(
  //   "start",
  //   sDate,
  //   "end",
  //   eDate,
  //   "fuel",
  //   fuelType?.name,
  //   "purpose",
  //   purposeUse?.name,
  //   "nozzle",
  //   noz?.value
  // );

  // console.log(data_g);
  // console.log(data_g?.length > 0);
  // console.log(pagi_g);

  const onPageChange = (event) => {
    console.log(event);
    fetchItGet(
      `detail-sale/pagi/by-date/${event}?sDate=${sDate}&eDate=${eDate}${purposeRoute}${fuelRoute}${nozzleRoute}`,
      token
    );
  };
  const [down, setDown] = useState(null);
  const [d, setD] = useState(false);
  const tableRef = useRef(null);
  const fun = () => {
    const { onDownload } = useDownloadExcel({
      currentTableRef: tableRef.current,
      filename: "Users table",
      sheet: "Users",
    });
    return onDownload;
  };

  console.log(tableRef.current != null, "ooooooooooooooooo");
  console.log(tableRef.current, "..............................");

  const recordsPerPage = 50;
  const totalPages = Math.ceil(pagi_g / recordsPerPage);

  function handleDownloadExcel() {
    downloadExcel({
      fileName: "Daily Sale Report",
      sheet: "Daily Sale Report",
      tablePayload: {
        header: tableHeader,
        // accept two different data structures
        body: data_g.map((e) => [
          e.vocono,
          e.createAt,
          e.carNo,
          e.vehicleType,
          e.nozzleNo,
          e.fuelType,
          (parseFloat(e?.saleLiter) / 4.16).toFixed(3),
          e.saleLiter,
          e.salePrice.toLocaleString(undefined, {
            maximumFractionDigits: 3,
          }),
          e.totalPrice.toLocaleString(undefined, {
            maximumFractionDigits: 3,
          }),
          e.totalizer_liter.toFixed(3),
          e.totalizer_amount.toLocaleString(undefined, {
            maximumFractionDigits: 3,
          }),
        ]),
      },
    });
  }

  const handlePrint = useReactToPrint({
    content: () => tableRef.current,
  });

  const utcTimestamp = pData?.createAt;
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
    <div className="w-full pt-28">
      <div className="flex flex-wrap gap-4 gap-x-10 justify-between">
        <CalendarPick date={sDate} setDate={setSDate} label="Start Date" />
        <CalendarPick date={eDate} setDate={setEDate} label="End Date" />
        <SelectDrop
          placeholder="All"
          label="Fuel Type"
          data={fuelData}
          value={fuelType}
          setValue={setFuelType}
        />
        <SelectDrop
          placeholder="All"
          label="Purpose of Use"
          data={purposes}
          value={purposeUse}
          setValue={setPurposeUse}
        />
        <SelectDrop
          label="Nozzle"
          placeholder="All"
          data={nozzleData}
          value={noz}
          setValue={setNoz}
        />

        <SearchButton onClick={() => fetchItGet(route, token)} />
      </div>
      <div className="w-[50%] hidden">
        {/* <PrinterT ref={componentRef} pData={pData} /> */}
        <div ref={componentRef}>
          <div style={{ fontSize: "0.8rem", textAlign: "center" }}>
            <div className="flex justify-center">
              <img
                src="../../../public/static/images/images.png"
                style={{
                  width: "25vw",
                  height: "70px",
                  width: "70px",
                  marginBottom: "5px",
                }}
              />
            </div>

            <table
              style={{
                fontSize: "0.7rem",
              }}
            >
              {/* <tr>
                <td style={{ fontWeight: "bold" }}>F.S Code</td>
                <td style={{ fontWeight: "bold" }}>F.S Code</td> */}
              {/* <td>: {read ? read?.station : "....."}</td> */}
              {/* </tr> */}
              <tr>
                <td style={{ fontWeight: "bold" }}>Station</td>
                <td>: {infoData?.station ? infoData?.station : "..."}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: "bold" }}>Voucher</td>
                <td>: {pData?.vocono}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: "bold" }}>Date</td>
                <td>
                  : {year}-{month}-{day} {hour}:{min}:{sec} {amPm}
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: "bold" }}>Car No.</td>
                <td>: {pData?.carNo}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: "bold" }}>Nozzle</td>
                <td>: {pData?.nozzleNo}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: "bold" }}>F.S Ph</td>
                <td style={{ fontWeight: "" }}>
                  {infoData?.phone1 ? infoData?.phone1 : "..."} /
                  {infoData?.phone2 ? infoData?.phone2 : "..."}
                </td>
                {/* <td>
              : {read ? read?.ph_1 : "....."} / {read ? read?.ph_2 : "....."}
            </td> */}
              </tr>
            </table>
          </div>
          <hr />
          <div style={{ marginTop: "-5px" }}>
            <table
              style={{
                fontSize: "0.6rem",
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
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
                <td style={{ padding: "10px 0px" }}>{pData?.fuelType}</td>
                <td>
                  {pData?.salePrice?.toFixed(2)} x{" "}
                  {pData?.saleLiter?.toFixed(2)}
                </td>
                <td>MMK</td>
                <td style={{ textAlign: "end" }}>
                  {pData?.totalPrice?.toFixed(2)}
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
                  {pData?.totalPrice?.toFixed(2)}
                </td>
              </tr>
            </table>
          </div>
          <div
            style={{
              fontSize: "0.7rem",
              textAlign: "center",
              marginTop: "-18px",
            }}
          >
            <h4>Thank you. Please come again.</h4>
          </div>
        </div>
      </div>
      {isData ? (
        <div className="mt-8">
          <FilterTable
            tableRef={tableRef}
            header={tableHeader}
            rows={tableRow}
          />
        </div>
      ) : (
        <div className="w-full h-[250px] gap-5 text-nodata flex items-center justify-center border-2 border-nodata mt-10 rounded-xl">
          <div className="flex items-center gap-4">
            <RiErrorWarningLine className="text-[6rem]" />
            <div className="font-mono text-[2.5rem]">NO DATA FOUND</div>
          </div>
        </div>
      )}
      {data_g && (
        <div className="">
          <Footer
            print={handlePrint}
            onClick={handleDownloadExcel}
            totalPages={totalPages}
            onPageChange={onPageChange}
            pagi="true"
            // first={first}
            // rows={rows}
          />
        </div>
      )}
    </div>
  );
};

export default DailySale;
