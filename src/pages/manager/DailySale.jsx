import React, { useEffect, useRef, useState } from "react";
import Nav from "../../components/Navbar/Nav";
import SearchButton from "../../components/SearchButton";
import SelectDrop from "../installer/SelectDrop";
import CalendarPick from "../../components/CalendarPick";
import { RiErrorWarningLine } from "react-icons/ri";
import Footer from "../../components/footer/Footer";
import { Modal, Table } from "@mantine/core";
import FilterTable from "../../components/table/FilterTable";
import UseGet from "../../api/hooks/UseGet";
import UseGet3 from "../../api/hooks/UseGet3";
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
import { BiError } from "react-icons/bi";
import ConAlert from "../../components/alert/ConAlert";
import TextInput from "../../components/inputbox/TextInput";
// import jwt from "jsonwebtoken";
import { useDisclosure } from "@mantine/hooks";
import { ImCross } from "react-icons/im";
import UsePatch from "../../api/hooks/UsePatch";
import Alert from "../../components/alert/Alert";
import ErrorAlert from "../../components/alert/ErrorAlert";
import { localInstance } from "../../api/axios";

const DailySale = () => {
  let start = new Date();
  start.setHours(0);
  start.setMinutes(0);
  start = new Date(start);

  let end = new Date();
  end.setHours(23);
  end.setMinutes(0);
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
  const [{ data_pch, loading_pch, error_pch }, patchIt] = UsePatch();

  const [sDate, setSDate] = useState(start);
  const [eDate, setEDate] = useState(end);
  const [fuelType, setFuelType] = useState();
  const [email, setEmail] = useState();
  const [pswd, setPswd] = useState();
  const [purposeUse, setPurposeUse] = useState();
  const [noz, setNoz] = useState();
  const [casher, setCasher] = useState();
  const [num, setNum] = useState();
  const [err, setErr] = useState(false);

  const purposeRoute = purposeUse?.value
    ? `&vehicleType=${purposeUse?.value}`
    : "";
  const fuelRoute = fuelType?.value ? `&fuelType=${fuelType?.value}` : "";
  const nozzleRoute = noz?.value ? `&nozzleNo=${noz?.value}` : "";
  const casherRoute = casher?.name ? `&casherCode=${casher?.name}` : "";
  const carNo = num ? `&carNo=${num}` : "";

  const route = `detail-sale/pagi/by-date/1?sDate=${sDate}&eDate=${eDate}${purposeRoute}${fuelRoute}${nozzleRoute}${casherRoute}${carNo}`;
  const [{ data_g, loading_g, error_g, pagi_g }, fetchItGet] = UseGet();
  const [{ data_g_3, loading_g_3, error_g_3, pagi_g_3 }, fetchItGet3] =
    UseGet3();
  const [con, setCon] = useState(false);

  useEffect(() => {
    setCon(true);
  }, []);

  useEffect(() => {
    fetchItGet(
      `detail-sale/pagi/by-date/1?sDate=${start}&eDate=${end}${purposeRoute}${fuelRoute}${nozzleRoute}${casherRoute}${carNo}`,
      token
    );
    fetchItGet3(`user`, token);
    console.log("hello");
  }, [con]);

  console.log(data_g_3, "ddddddddddddddddhhhhhhhhhh");

  useEffect(() => {
    if (data_g?.length > 0) {
      setIsData(true);
    } else {
      setIsData(false);
    }
  }, [data_g, loading_g, error_g, fetchItGet]);

  // console.log(totalPages);

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
  const tableRow = data_g?.map((element) => (
    <Table.Tr
      key={element.no}
      style={
        element.asyncAlready == "2" && {
          backgroundColor: "#06B6D420",
        }
      }
      className=" duration-150 text-sm text-center"
    >
      <Table.Td>{element.vocono}</Table.Td>
      <Table.Td>
        {element.createAt.slice(0, 10)} {element.createAt.slice(11, 19)}
      </Table.Td>
      <Table.Td>{element.carNo}</Table.Td>
      <Table.Td>{element.vehicleType}</Table.Td>
      <Table.Td>{element.nozzleNo}</Table.Td>
      <Table.Td>{element.fuelType}</Table.Td>
      <Table.Td>{(parseFloat(element?.saleLiter) / 4.16).toFixed(3)}</Table.Td>
      <Table.Td>{element.saleLiter}</Table.Td>
      <Table.Td>
        {element.salePrice.toFixed(2).toLocaleString(undefined, {
          maximumFractionDigits: 3,
        })}
      </Table.Td>
      <Table.Td>
        {element.totalPrice.toFixed(2).toLocaleString(undefined, {
          maximumFractionDigits: 3,
        })}
      </Table.Td>
      <Table.Td>{element.totalizer_liter.toFixed(3)}</Table.Td>
      <Table.Td>
        {element.totalizer_amount.toFixed(2).toLocaleString(undefined, {
          maximumFractionDigits: 3,
        })}
      </Table.Td>
      <Table.Td className="flex items-center justify-center">
        {element.saleLiter == "0" && (
          <div
            onClick={() => {
              open(), setDdata({ id: element._id, noz: element.nozzleNo });
            }}
            className="bg-[#f7e87b] active:scale-90 duration-75 cursor-pointer flex w-10 h-10 items-center  rounded-full justify-center "
          >
            <BiError className="text-2xl text-gray-500 -mt-1" />
          </div>
        )}
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

  const [opened, { open, close }] = useDisclosure(false);

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
  // detail-sale/error?_id=65fffed0d3b06770ade5fe29&nozzleNo=02

  const [ddata, setDdata] = useState({});

  // const handleClick = () => {
  //   const data = { email: email, password: pswd };

  //   patchIt(
  //     `detail-sale/error?_id=${ddata.id}&nozzleNo=${ddata.noz}`,
  //     data,
  //     token
  //   );
  // };

  // // if (error_pch) {
  // //   setErr(true);
  // // } else {
  // //   setErr(false);
  // //   close();
  // // }

  // console.log(
  //   data_pch,
  //   error_pch?.response.data.con,
  //   "ellllelellllllllllllllllllllllllllllleeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
  // );

  const handleClick = async () => {
    const data = { email: email, password: pswd };

    try {
      //  patchIt(
      //     `detail-sale/error?_id=${ddata.id}&nozzleNo=${ddata.noz}`,
      //     data,
      //     token
      //   );

      const response = await localInstance.patch(
        `detail-sale/error?_id=${ddata.id}&nozzleNo=${ddata.noz}`,
        data,
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(
        response,
        "lllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll"
      );
      // Check if there's any error in the response data
      if (!response?.data?.con) {
        // If there's an error, set the error state to true
        setErr(true);
      } else {
        // If there's no error, close the modal and reset the error state
        setCon(!con);
        close();
        setErr(false);
      }
    } catch (error) {
      // If an error occurs during the API call, set the error state to true
      setErr(true);
    }
  };

  return (
    <>
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
          <SelectDrop
            label="Cashier"
            placeholder="All"
            data={data_g_3}
            value={casher}
            setValue={setCasher}
          />
          <TextInput
            style="!w-[300px]"
            label="Vehicle Number"
            placeholder="Vehicle Number"
            value={num}
            onChange={(e) => setNum(e.target.value)}
          />
          <SearchButton onClick={() => fetchItGet(route, token)} />
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
      <Modal
        opened={opened}
        radius={20}
        size={700}
        centered
        withCloseButton={false}
      >
        <div className="flex  border-b mb-4 border-gray-300 pb-3 items-end">
          <div className="flex justify-between items-center">
            <div className="text-2xl ms-4 select-none text-text font-semibold font-sans">
              Authorization
            </div>
            {err && (
              <div className="text-red-500 ms-10">Something was wrong !</div>
            )}
          </div>
          <div
            onClick={() => {
              close();
            }}
            className="w-12 h-12 rounded-full ms-auto  bg-danger text-secondary hover:border-2 border-2 border-danger hover:border-danger duration-100 hover:bg-transparent hover:text-danger flex items-center justify-center"
          >
            <ImCross />
          </div>
        </div>
        <div className=" px-4">
          <div className="flex justify-between">
            <div className="flex mb-4 justify-between">
              <div className="">
                <TextInput
                  style="!w-[300px]"
                  label="Email "
                  placeholder="Email "
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-between">
              <div className="">
                <TextInput
                  style="!w-[300px]"
                  label="Password"
                  placeholder="Password"
                  value={pswd}
                  onChange={(e) => setPswd(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className=" flex items-center justify-between">
            <button
              // onClick={
              //   email !== undefined && pswd !== undefined 
              //     ? ConAlert("Are you sure ?", handleClick)
              //     : () => ErrorAlert("Some Fields are Empty")
              // }
              onClick={handleClick}
              className={`w-[300px] ml-auto mt-2 text-secondary  items-center justify-center gap-3 flex  font-mono text-xl active:scale-95 duration-100 bg-[#38b59e] h-[56px] rounded-md`}
            >
              Update
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DailySale;
