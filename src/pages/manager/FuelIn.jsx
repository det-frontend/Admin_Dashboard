import React, { useEffect, useRef, useState } from "react";
import Nav from "../../components/Navbar/Nav";
import SearchButton from "../../components/SearchButton";
import SelectDrop from "../../components/SelectDrop";
import purpose from "../../testBeforeApi/data/pou";
import nozz from "../../testBeforeApi/data/nozzle";
import fuel from "../../testBeforeApi/data/fueltype";
import tank from "../../testBeforeApi/data/tank";
import CalendarPick from "../../components/CalendarPick";
import { Loader } from "@mantine/core";
import { Calendar } from "primereact/calendar";
import { ToggleButton } from "primereact/togglebutton";
import { RiErrorWarningLine } from "react-icons/ri";
import TextInput from "../../components/inputbox/TextInput";
import Footer from "../../components/footer/Footer";
import { useNavigate } from "react-router-dom";
import FilterTable from "../../components/table/FilterTable";
import fuelData from "../installer/drop_data/manager/managerFuel";
import useTokenStorage from "../../utils/useDecrypt";
import UseGet from "../../api/hooks/UseGet";
import { Table } from "@mantine/core";
import FuelInDrop from "../../components/FuelInDrop";
import UseGet3 from "../../api/hooks/UseGet3";
import UsePost from "../../api/hooks/UsePost";
import { useReactToPrint } from "react-to-print";
import { downloadExcel } from "react-export-table-to-excel";
import ConAlert from "../../components/alert/ConAlert";
import Swal from "sweetalert2";
import UseGet2 from "../../api/hooks/UseGet2";

const FuelIn = () => {
  console.log(purpose);
  const [isData, setIsData] = useState(true);
  const [pou, setPou] = useState();
  const [noz, setNoz] = useState();
  const [stock, setStock] = useState();
  const [fuelType, setFuelType] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [date, setDate] = useState(null);
  const [receive, setReceive] = useState();
  const navigate = useNavigate();
  const [{ data_g_3, loading_g_3, error_g_3, pagi_g_3 }, fetchItGet3] =
    UseGet3();
  const [{ data_g_2, loading_g_2, error_g_2 }, fetchItGet2] = UseGet2();
  const [{ data, loading, error }, fetchIt] = UsePost();
  const [driverName, setDriverName] = useState();
  const [number, setNumber] = useState();
  const tableRef = useRef(null);
  console.log(fuelType?._id, receive, "hlelllllllllllllllllllllllllllll");
  console.log(data_g_2);
  let start = new Date();
  const [token, setToken] = useState("none");
  const [sDate, setSDate] = useState(start);

  const { loadToken } = useTokenStorage();
  useEffect(() => {
    const token = loadToken();
    if (token) {
      setToken(token);
    }
  }, []);

  const onPageChange = (event) => {
    fetchItGet3(`/fuelIn/pagi/${event}`, token);
  };

  const recordsPerPage = 50;
  const totalPages = Math.ceil(pagi_g_3 / recordsPerPage);

  const formattedDate = sDate.toISOString().split("T")[0];

  // const route = `/balance-statement/?reqDate=2024-03-11`;
  const route = `/balance-statement/?reqDate=${formattedDate}`;
  // const route = `/balance-statement/?reqDate=${formattedDate}`;
  console.log(formattedDate, route);
  const [{ data_g, loading_g, error_g, pagi_g }, fetchItGet] = UseGet();

  const [con, setCon] = useState(false);

  useEffect(() => {
    setCon(true);
  }, []);

  useEffect(() => {
    fetchItGet(route, token);
    console.log("hello");
  }, [con, data]);

  console.log(data_g);

  const tableHeader = [
    "Receive Data",
    "Fuel Type",
    // "Fuel in Code",
    "Driver",
    "Bowser No",
    // "Tank",
    // "Tank Capacity",
    "Receive Volume",
    // "Balance",
  ];
  const tableRow = stock?.map((element) => (
    <Table.Tr key={element.no} className=" duration-150 text-sm text-center">
      <Table.Td>{element.receive_date}</Table.Td>
      <Table.Td>{element.fuel_type}</Table.Td>
      <Table.Td>{element.driver}</Table.Td>
      <Table.Td>{element.bowser}</Table.Td>
      <Table.Td>{element.receiveAmount}</Table.Td>
      {/* <Table.Td>{element.balance}</Table.Td> */}
      {/* <Table.Td>{element.saleLiter}</Table.Td> */}
      {/* <Table.Td>
        {element.salePrice.toLocaleString(undefined, {
          maximumFractionDigits: 3,
        })}
      </Table.Td>
      <Table.Td>
        {element.totalPrice.toLocaleString(undefined, {
          maximumFractionDigits: 3,
        })}
      </Table.Td>
      <Table.Td>{element.totalizer_liter.toFixed(3)}</Table.Td>
      <Table.Td>
        {element.totalizer_amount.toLocaleString(undefined, {
          maximumFractionDigits: 3,
        })}
      </Table.Td> */}
    </Table.Tr>
  ));

  // const [con, setCon] = useState(false);
  // const formattedDate2 = today.toISOString().split("T")[0];
  useEffect(() => {
    setCon(true);
  }, []);

  console.log(
    `/balance-statement/receive-balance?id=${fuelType?._id}`,
    {
      receiveAmount: receive,
      driver: driverName,
      bowser: number,
      fuel_type: fuelType?.fuelType,
    },
    "...................................................................................................."
  );

  useEffect(() => {
    fetchItGet3(`/fuelIn/pagi/1`, token);
    fetchItGet2(`/balance-statement/?reqDate=${formattedDate}`, token);

    console.log("wkwk");
  }, [con, data]);

  const handleClick = () => {
    // const formattedDate2 = sDate.toISOString().split("T")[0];
    fetchIt(
      `/balance-statement/recive-balance?id=${fuelType?._id}`,
      {
        receiveAmount: receive,
        driver: driverName,
        bowser: number,
        fuel_type: fuelType?.fuelType,
      },
      token
    );
    setReceive("");
    setFuelType("");
    setDriverName("");
    setNumber("");
  };

  useEffect(() => {
    // setStock(data_g_3); normal
    setStock(data_g_3.reverse().slice(0, 10));
  }, [data_g_3, data]);

  const handlePrint = useReactToPrint({
    content: () => tableRef.current,
  });

  useEffect(() => {
    if (data.con == true) {
      Swal.fire({
        title: "Fuel added successfully!",
        icon: "success",
        buttonsStyling: false,
        iconColor: "#38b59e",
        color: "#38b59e",
        width: "25em",
        background: "#ffffff",
        customClass: {
          title: "text-white",
          confirmButton:
            "bg-detail text-secondary rounded-lg border-2 border-detail hover:text-[#38b59e] duration-150 hover:bg-secondary w-[300px] font-mono py-2",
        },
      });
    }
  }, [data]);

  function handleDownloadExcel() {
    downloadExcel({
      fileName: "Fuel Receive",
      sheet: "Fuel Receive",
      tablePayload: {
        header: tableHeader,
        // accept two different data structures
        body: data_g.map((e) => [
          e.receive_date,
          e.fuel_type,
          e.driver,
          e.bowser,
          e.receiveAmount,
        ]),
      },
    });
  }

  return (
    <div className="w-full pt-28">
      <div className="flex flex-wrap gap-4 gap-x-10 justify-between">
        {/* <SelectDrop
          label="Tank Number"
          data={tank}
          value={fuelType}
          setValue={setFuelType}
        /> */}
        <FuelInDrop
          placeholder="Please Select"
          label="Fuel Type"
          data={data_g_2}
          value={fuelType}
          setValue={setFuelType}
        />
        <TextInput
          style="!w-[300px]"
          label="Receive Liters"
          placeholder="Receive Liters"
          value={receive}
          onChange={(e) => setReceive(e.target.value)}
        />
        <TextInput
          style="!w-[300px]"
          label="Driver Name"
          placeholder="Driver Name"
          value={driverName}
          onChange={(e) => setDriverName(e.target.value)}
        />
        <TextInput
          style="!w-[300px]"
          label="Bowser No"
          placeholder="Bowser No"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        />
        <SearchButton
          title="ADD"
          onClick={ConAlert("Are you sure ?", true, handleClick)}
        />
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
      <Footer
        print={handlePrint}
        onClick={handleDownloadExcel}
        totalPages={totalPages}
        onPageChange={onPageChange}
        pagi="true"
      />
    </div>
  );
};

export default FuelIn;
