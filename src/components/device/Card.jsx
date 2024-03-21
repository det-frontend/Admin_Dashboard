import React, { useContext, useEffect, useRef, useState } from "react";
import "./card.css";
import { motion } from "framer-motion";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Button } from "@mantine/core";
import RealTimeForms from "./RealTimeForms";
import RealTimeCounting from "./RealTimeCounting";
import ErrorForms from "./ErrorForms";
import ReadyState from "./ReadyState";
import { ImCross } from "react-icons/im";
import { localInstance } from "../../api/axios";
import useTokenStorage from "../../utils/useDecrypt";
import LoadContext from "../../services/LoadContext";

const Card = ({
  Client,
  dis,
  permitReq,
  num,
  onClick,
  title = "1",
  obj,
  active,
  noMorePermit,
  setPayloadHistory,
  nozzle1FuelDetail,
  finalData,
  allDone,
  setLiveData,
  setFinalData,
  setAllDone,
  // setFetchNew,
  // checkLiveRef,
  approve,
  setApprove,
  // loading,
  // setLoading,
  liveDespenserHistory,
}) => {
  const { loading, setLoading } = useContext(LoadContext);

  const [isPermit, setIsPermit] = useState(false);
  const [isErrorCon, setIsErrorCon] = useState(false);
  const [premitFormInfo, setPremitFormInfo] = useState();
  const [printFormInfo, setPrintFormInfo] = useState();
  const [noPermit, setNopermit] = useState(false);
  const [saleLiter, setSaleLiter] = useState(0);
  const [salePrice, setSalePrice] = useState(0);
  const [final, setFinal] = useState(false);
  const [httpCode, setHttpCode] = useState(false);
  const [permitState, setPermitState] = useState(false);
  const [nozzleActive, setNozzleActive] = useState(false);
  const [realTimeEdit, setRealTimeEdit] = useState({
    objId: "",
    cashType: "",
    carNo: "",
    purpose_of_use: "",
    couObjId: "",
    couName: "",
    couId: "",
  });
  const [chooseOne, setChooseOne] = useState(false);
  const [realTimeEditChooseOne, setRealTimeEditChooseOn] = useState(false);
  const [fetchObj, setFetchObj] = useState();
  const [managerUserName, setManagerUserName] = useState(undefined);
  const [managerPassword, setManagerPassword] = useState(undefined);
  const [errorPermission, setErrorPermission] = useState("");
  const [errorUpdate, setErrorUpdate] = useState("");
  const [readyState, setReadyState] = useState("");
  const [readyStateObj, setReadyStateObj] = useState("");
  const [vocNumber, setVocNumber] = useState("");
  const [presetButtonDisable, setPresetButtonDisable] = useState(false);
  const [permitButtonDisable, setPermitButtonDisable] = useState(false);
  const [token, setToken] = useState("none");
  const { loadToken } = useTokenStorage();
  useEffect(() => {
    const token = loadToken();
    if (token) {
      setToken(token);
    }
  }, []);
  const [isClosed, setIsClosed] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isAlready, setIsAlready] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [price, setPrice] = useState(0);
  const [liter, setLiter] = useState(0);
  const checkLiveRef = useRef({
    nozzleNo: "",
  });

  const regex = /[A-Z]/g;

  const nozzle1FuelDetailRef = useRef({ liter: "", price: "" });

  Client.on("message", (topic, message) => {
    if (topic.startsWith("detpos/device/livedata/") && /[1-8]$/.test(topic)) {
      let data = message.toString().split(regex);
      const updatedNozzle1FuelDetail = {
        liter: data[1],
        price: data[2],
        nozzleNo: data[0],
      };

      const checkLive = {
        nozzleNo: data[0],
      };

      checkLiveRef.current = {
        ...checkLiveRef.current,
        ...checkLive,
      };

      nozzle1FuelDetailRef.current = {
        ...nozzle1FuelDetailRef.current,
        ...updatedNozzle1FuelDetail,
      };

      if (parseInt(data[0]) === parseInt(obj.nozzle_no)) {
        setLiter(parseFloat(data[1])); // assuming liter is a numeric value
        setPrice(parseFloat(data[2])); // assuming price is a numeric value
        // console.log("llllll");
      }
      // console.log(price, liter);
      // console.log(
      //   nozzle1FuelDetailRef.current,
      //   "----------------------------------------"
      // );
    }
    if (topic.startsWith("detpos/device/Final/") && /[1-8]$/.test(topic)) {
      close();
      setNozzleActive(false);
    }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const { nozzleNo } = checkLiveRef.current;

      if (parseInt(nozzleNo) === parseInt(obj.nozzle_no)) {
        setNozzleActive(true);
        setNopermit(false);

        if (active) {
          if (parseInt(nozzleNo) === parseInt(obj.nozzle_no)) {
            setNozzleActive(true);
            setNopermit(false);
          }
        }
        checkLiveRef.current.nozzleNo = 0;
      }
    }, 200); // Update the values every second

    return () => {
      clearInterval(interval);
    };
  }, []);

  // useEffect(() => {
  //   setSaleLiter(liter);
  //   setSalePrice(price);
  // }, [price, liter]);

  // console.log(permitReq, obj.nozzle_no, ".........................");

  // console.log("con for ", parseInt(finalData), "and ", parseInt(obj.nozzle_no));

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const { liter, price, nozzleNo } = nozzle1FuelDetail.current;

  //     if (parseInt(nozzleNo) == parseInt(printFormInfo.nozzle_no)) {
  //       setPrice(price);
  //       setLiter(liter);
  //     } else {
  //       console.log("err");
  //     }
  //   }, 100); // Update the values every second

  //   return () => {
  //     clearInterval(interval);
  //   };

  // }, []);

  console.log(noMorePermit, "jljljljlkjljljljljlkjlkj");

  const [myInfo, setMyInfo] = useState({
    objectId: null,
    saleLiter: 0,
    salePrice: 0,
    couObjId: null,
    vehicleType: null,
    cashType: null,
    vocono: null,
  });

  const handleCardClick = () => {
    open();
  };
  // console.log(finalData, "and final is", final, "and all done is ", allDone);

  // console.log(printFormInfo, "......................");
  // console.log(token);
  const handleReadyState = async () => {
    if (!presetButtonDisable) {
      setPresetButtonDisable(true);
    }

    if (premitFormInfo.type === "Liters") {
      setLoading(true);
      const permitObject = await localInstance.post(
        `detail-sale/preset?depNo=${obj.dep_no}&nozzleNo=${obj.nozzle_no}`,
        {
          nozzleNo: obj.nozzle_no,
          fuelType: obj.fuel_type,
          liter: parseFloat(premitFormInfo.value).toFixed(2),
          carNo: !premitFormInfo.carNo == "" ? premitFormInfo.carNo : "-",
          vehicleType: premitFormInfo.vehicleType,
          cashType: premitFormInfo.cashType,
          salePrice: obj.daily_price,
          device: "website",
        },
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "multipart/form-data", // Adjust content type based on your API requirements
          },
        }
      );
      setLoading(false);
      close();

      if (permitObject.data?.con) {
        setPayloadHistory((prevTopics) => [
          ...prevTopics,
          parseInt(obj.nozzle_no),
        ]);
      }

      if (!permitObject.data?.con) {
        setPermitState(true);
        let smg = permitObject.data.msg;
        smg = smg.split(":");
        smg = smg[2];

        setVocNumber(smg);
        return;
      }

      if (permitObject.data?.result) {
        setHttpCode(true);
        setFetchObj(permitObject.data.result);
        setPrintFormInfo({
          nozzle_no: obj.nozzle_no,
          objId: permitObject.data.result._id,
          vocono: permitObject.data.result.vocono,
          cashType: permitObject.data.result.cashType,
          carNo: permitObject.data.result.carNo,
          purposeOfUse: permitObject.data.result.vehicleType,
          customerName: premitFormInfo.couName,
          customerId: premitFormInfo.cou_id,
          customerObjId: premitFormInfo.couObjId,
        });
        setRealTimeEdit({
          object_Id: permitObject.data.result._id,
          cash_type: permitObject.data.result.cashType,
          car_no: permitObject.data.result.carNo,
          purpose_of_use: permitObject.data.result.vehicleType,
          customer_name: premitFormInfo.couName,
          customer_id: premitFormInfo.cou_id,
        });
        setIsPermit(true);
      }

      if (!permitObject.data?.con) {
        // auth.logOut();
      }
      setReadyState(false);
    }

    if (premitFormInfo.type === "Kyats") {
      setLoading(true);
      const permitObject = await localInstance.post(
        `detail-sale/preset?depNo=${obj.dep_no}&nozzleNo=${obj.nozzle_no}`,
        {
          nozzleNo: obj.nozzle_no,
          fuelType: obj.fuel_type,
          kyat: premitFormInfo.value,
          carNo: !premitFormInfo.carNo == "" ? premitFormInfo.carNo : "-",
          vehicleType: premitFormInfo.vehicleType,
          cashType: premitFormInfo.cashType,
          salePrice: obj.daily_price,
          device: "website",
        },
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "multipart/form-data", // Adjust content type based on your API requirements
          },
        }
      );

      if (permitObject.data?.con) {
        setPayloadHistory((prevTopics) => [
          ...prevTopics,
          parseInt(obj.nozzle_no),
        ]);
        if (!permitObject.data?.con) {
          setPermitState(true);
          let smg = permitObject.data.msg;
          smg = smg.split(":");
          smg = smg[2];

          setVocNumber(smg);
          return;
        }

        setLoading(false);
        close();

        if (permitObject.data?.result) {
          setHttpCode(true);
          setFetchObj(permitObject.data.result);
          setPrintFormInfo({
            nozzle_no: obj.nozzle_no,
            objId: permitObject.data.result._id,
            vocono: permitObject.data.result.vocono,
            cashType: permitObject.data.result.cashType,
            carNo: permitObject.data.result.carNo,
            purposeOfUse: permitObject.data.result.vehicleType,
            customerName: premitFormInfo.couName,
            customerId: premitFormInfo.cou_id,
            customerObjId: premitFormInfo.couObjId,
          });
          setRealTimeEdit({
            object_Id: permitObject.data.result._id,
            cash_type: permitObject.data.result.cashType,
            car_no: permitObject.data.result.carNo,
            purpose_of_use: permitObject.data.result.vehicleType,
            customer_name: premitFormInfo.couName,
            customer_id: premitFormInfo.cou_id,
          });
          setIsPermit(true);
        }

        if (!permitObject.data?.con) {
          // auth.logOut();
        }

        setReadyState(false);
      }
    }

    setTimeout(() => {
      setPresetButtonDisable(false);
    }, 3000);
  };

  const handlePermit = async () => {
    setNopermit(false);
    if (
      premitFormInfo.couObjId == undefined &&
      premitFormInfo.cashType == "Debt"
    ) {
      setChooseOne(true);
      return;
    } else {
      if (!permitButtonDisable) {
        setPermitButtonDisable(true);
      }
      setLoading(true);
      setChooseOne(false);

      // const permitObject = await PermitApi.permit(
      //   obj.dep_no,
      //   obj.nozzle_no,
      //   premitFormInfo.vehicleType,
      //   premitFormInfo.carNo,
      //   premitFormInfo.cashType,
      //   obj.fuel_type,
      //   premitFormInfo.couObjId,
      //   obj.daily_price
      // );

      const permitObject = await localInstance.post(
        `detail-sale?depNo=${obj.dep_no}&nozzleNo=${obj.nozzle_no}`,
        {
          nozzleNo: obj.nozzle_no,
          fuelType: obj.fuel_type,
          carNo: !premitFormInfo.carNo == "" ? premitFormInfo.carNo : "-",
          vehicleType: premitFormInfo.vehicleType,
          cashType: premitFormInfo.cashType,
          couObjId: premitFormInfo.couObjId,
          device: "website",
        },
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "multipart/form-data", // Adjust content type based on your API requirements
          },
        }
      );

      setLoading(false);

      if (permitObject) {
        setPermitButtonDisable(false);
      }

      if (!permitObject.data?.result) {
        setPermitState(true);
        // let smg = permitObject.data.msg;
        // console.log("smg",smg)
        // smg = smg.split(":");
        // smg = smg[2];
        // setVocNumber(smg);
        setPayloadHistory((prevTopics) => {
          // Filter out elements that match the value of parseInt(obj.nozzle_no)
          const updatedTopicsArray = prevTopics.filter(
            (topic) => topic !== parseInt(obj.nozzle_no)
          );

          return updatedTopicsArray;
        });
        setVisible(false);
        return;
      }

      if (permitObject.data?.result) {
        setHttpCode(true);
        setFetchObj(permitObject.data.result);
        setPrintFormInfo({
          nozzle_no: obj.nozzle_no,
          objId: permitObject.data.result.screenuObjId,
        });

        setRealTimeEdit({
          object_Id: permitObject.data.result._id,
          cash_type: permitObject.data.result.cashType,
          car_no: permitObject.data.result.carNo,
          purpose_of_use: permitObject.data.result.vehicleType,
          customer_name: premitFormInfo.couName,
          customer_id: premitFormInfo.cou_id,
        });
        setIsPermit(true);
      }

      if (!permitObject.data?.con) {
        // auth.logOut();
      }

      close();

      //  setTimeout(() => {
      //     setPermitButtonDisable(false);
      //   }, 2000); // 2000 milliseconds (2 seconds)
    }
  };
  const handlePermit1 = async () => {
    setPayloadHistory((prevTopics) => [...prevTopics, parseInt(obj.nozzle_no)]);
    setNopermit(false);
    if (
      premitFormInfo.couObjId == undefined &&
      premitFormInfo.cashType == "Debt"
    ) {
      setChooseOne(true);
      return;
    } else {
      if (!permitButtonDisable) {
        setPermitButtonDisable(true);
      }
      setLoading(true);
      setChooseOne(false);

      // const permitObject = await PermitApi.permit(
      //   obj.dep_no,
      //   obj.nozzle_no,
      //   premitFormInfo.vehicleType,
      //   premitFormInfo.carNo,
      //   premitFormInfo.cashType,
      //   obj.fuel_type,
      //   premitFormInfo.couObjId,
      //   obj.daily_price
      // );

      const permitObject = await localInstance.post(
        `detail-sale?depNo=${obj.dep_no}&nozzleNo=${obj.nozzle_no}`,
        {
          nozzleNo: obj.nozzle_no,
          fuelType: obj.fuel_type,
          carNo: !premitFormInfo.carNo == "" ? premitFormInfo.carNo : "-",
          vehicleType: premitFormInfo.vehicleType,
          cashType: premitFormInfo.cashType,
          couObjId: premitFormInfo.couObjId,
          device: "website",
        },
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "multipart/form-data", // Adjust content type based on your API requirements
          },
        }
      );

      setLoading(false);

      if (permitObject) {
        setPermitButtonDisable(false);
      }

      if (!permitObject.data?.result) {
        setPermitState(true);
        // let smg = permitObject.data.msg;
        // console.log("smg",smg)
        // smg = smg.split(":");
        // smg = smg[2];
        // setVocNumber(smg);
        setPayloadHistory((prevTopics) => {
          // Filter out elements that match the value of parseInt(obj.nozzle_no)
          const updatedTopicsArray = prevTopics.filter(
            (topic) => topic !== parseInt(obj.nozzle_no)
          );

          return updatedTopicsArray;
        });
        setVisible(false);
        return;
      }

      if (permitObject.data?.result) {
        setHttpCode(true);
        setFetchObj(permitObject.data.result);
        setPrintFormInfo({
          nozzle_no: obj.nozzle_no,
          objId: permitObject.data.result.screenuObjId,
        });

        setRealTimeEdit({
          object_Id: permitObject.data.result._id,
          cash_type: permitObject.data.result.cashType,
          car_no: permitObject.data.result.carNo,
          purpose_of_use: permitObject.data.result.vehicleType,
          customer_name: premitFormInfo.couName,
          customer_id: premitFormInfo.cou_id,
        });
        setIsPermit(true);
      }

      if (!permitObject.data?.con) {
        // auth.logOut();
      }

      close();

      //  setTimeout(() => {
      //     setPermitButtonDisable(false);
      //   }, 2000); // 2000 milliseconds (2 seconds)
    }
  };

  const handlePrint = () => {
    setLoading(true);

    const update = async () => {
      const response = await ToCloudApi.updateInfos(
        printFormInfo.objId,
        printFormInfo.cashType,
        printFormInfo.carNo,
        printFormInfo.purposeOfUse,
        premitFormInfo.customerObjId
      );
    };
    setLoading(false);
    setVisible(false);
    setIsClosed(false);
    setIsPermit(false);

    update();
  };

  const handleErrorCon = () => {
    setIsErrorCon(true);
  };

  const handleBack = () => {
    setIsErrorCon(false);
  };

  const handleRealTimeUpdate = async () => {
    if (realTimeEdit.customer_id == "" && printFormInfo.cashType == "Debt") {
      setRealTimeEditChooseOn(true);
      return;
    } else {
      setRealTimeEditChooseOn(false);

      // const fetchIt = async () => {
      //   setLoading(true);
      //   const response = await UpdateInfosApi.updateInfos(
      // printFormInfo.objId,
      // printFormInfo.cashType,
      // printFormInfo.carNo,
      // printFormInfo.purposeOfUse,
      // printFormInfo.customerObjId
      //   );

      //   setLoading(false);
      // };

      const fetchIt = await localInstance.patch(
        `/detail-sale?_id=${printFormInfo.objId}`,
        {
          cashType: printFormInfo.cashType,
          carNo: printFormInfo.carNo,
          vehicleType: printFormInfo.purposeOfUse,
          couObjId: printFormInfo.customerObjId,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "multipart/form-data", // Adjust content type based on your API requirements
          },
        }
      );

      // console.log(fetchIt);

      // fetchIt();
    }
  };

  // useEffect(() => {
  //   console.log(liveDespenserHistory);
  // },[liveDespenserHistory])
  // console.log(noMorePermit, "no more permit and obj.nozzle ", obj.nozzle_no);
  useEffect(() => {
    if (parseInt(noMorePermit) === parseInt(obj.nozzle_no)) {
      setNopermit(true);
      setVisible(false);
      setNozzleActive(false);
      // console.log("hlhlhhhhhhlhlhlhlhlhlhh");

      setPayloadHistory((prev) =>
        prev.filter((number) => number !== parseInt(obj.nozzle_no))
      );
      setPayloadHistory((prev) => [...prev, obj.nozzle_no]);
    }

    if (parseInt(noMorePermit) !== parseInt(obj.nozzle_no)) {
      setNopermit(false);
    }
  }, [noMorePermit]);

  useEffect(() => {
    if (parseInt(finalData) == parseInt(obj.nozzle_no)) {
      setFinal(true);
      setPermitState(true);
      setNozzleActive(false);
      setPrice(0);
      setLiter(0);
      // console.log("wk................................................");
    }
  }, [finalData]);

  // console.log(allDone, "all done in permits");
  // console.log(nozzleActive, "active nozzle active?", obj.nozzle_no);
  useEffect(() => {
    if (parseInt(allDone) == parseInt(obj.nozzle_no)) {
      setLiveData("");
      setNozzleActive(false);
      setVisible(false);
      setIsClosed(false);
      setIsPermit(false);
      setPrice(0);
      setLiter(0);
      setFinal(false);
      setNopermit(false);
      setFinalData(obj.nozzle_no);
      setAllDone(false);
      setPermitState(false);
      // setFetchNew((prev) => !prev);

      // Resetting values
      obj.current = {};

      checkLiveRef.current.nozzleNo == 0;

      setPayloadHistory((prev) =>
        prev.filter((number) => number !== parseInt(obj.nozzle_no))
      );

      setApprove((prev) =>
        prev.filter((number) => number !== parseInt(obj.nozzle_no))
      );
    }
  }, [allDone]);
  // console.log(obj, ".....ggggggg.......................");
  // useEffect(() => {
  //   if (active) {
  //     if (parseInt(liveData) === parseInt(obj.nozzle_no)) {
  //       setNozzleActive(true);
  //       setNopermit(false);
  //     }
  //   }
  // }, [active]);

  // console.log(liter, price);

  // useEffect(() => {
  //   const updateValues = () => {
  //     const { liter, price, nozzleNo } = nozzle1FuelDetail.current;

  //     if (parseInt(nozzleNo) === parseInt(printFormInfo?.nozzle_no)) {
  //       setPrice(price);
  //       setLiter(liter);
  //     }
  //   };

  //   const interval = setInterval(updateValues, 100);

  //   parseInt(allDone) === parseInt(obj.nozzle_no) && clearInterval(interval);
  // }, [nozzle1FuelDetail.current]);

  // useEffect(() => {
  //   const updateValues = () => {
  //     const { liter, price, nozzleNo } = nozzle1FuelDetail.current;

  //     if (parseInt(nozzleNo) === parseInt(printFormInfo?.nozzle_no)) {
  //       setPrice(price);
  //       setLiter(liter);
  //     }
  //   };
  //   console.log(liter, price, "gggggggggggggggggggggggggggggggggggg");
  //   const interval = setInterval(updateValues, 100);

  //   // Cleanup function to clear the interval when the component is unmounted or finished
  //   // return () => clearInterval(interval);

  //   // Dependencies array should include variables that are used inside the effect
  // }, []);

  // console.log(nozzle1FuelDetail.current);

  const handleUpdate = () => {
    if (managerPassword == undefined && managerUserName == undefined) {
      setErrorPermission(true);
    } else {
      setErrorPermission(false);
      const errorUpdate = async () => {
        setLoading(true);

        const response = await localInstance.patch(
          `/detail-sale/error?_id=${printFormInfo.objId}&nozzleNo=${printFormInfo.nozzle_no}`,
          {
            salePrice: obj.daily_price,
            email: managerUserName,
            password: managerPassword,
          },
          {
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "multipart/form-data", // Adjust content type based on your API requirements
            },
          }
        );

        if (response.data.con === true) {
          setPrintFormInfo("");
          setErrorUpdate("");
          setPayloadHistory((prev) =>
            prev.filter(
              (number) => parseInt(number) !== parseInt(obj.nozzle_no)
            )
          );

          setIsPermit(false);
          setIsErrorCon(false);

          setLiveData("");

          setFinal(false);
          setNopermit(false);
          setNozzleActive(false);
          setFinalData(false);
          setAllDone(false);
          setPermitState(false);

          setVisible(false);
          setIsClosed(false);
          setPayloadHistory((prev) =>
            prev.filter(
              (number) => parseInt(number) !== parseInt(obj.nozzle_no)
            )
          );
        } else {
          setErrorUpdate(response.data.msg);
        }

        setLoading(false);
      };

      errorUpdate();
    }
  };

  const handleReadyClick = () => {
    setReadyState(true);
    open();
  };

  // console.log(premitFormInfo, "........................................");
  // console.log(
  //   noMorePermit,
  //   obj.nozzle_no,
  //   // parseInt(noMorePermit) === parseInt(obj.nozzle_no),
  //   nozzleActive,
  //   ";;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;",
  //   obj.nozzle_no
  // );

  const handleReadyPermit = () => {};

  // const color = "#7A4DF1";

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.9 }}
        onClick={active ? handleCardClick : handleReadyClick}
        className={`${
          active
            ? noPermit
              ? "card"
              : final
              ? "card3"
              : nozzleActive
              ? "card4"
              : !permitReq
              ? "card5"
              : "card2"
            : "card"
          // active
          //   ? noPermit
          //     ? "card"
          //     : final
          //     ? "card3"
          //     : nozzleActive
          //     ? "card4"
          //     : // : !permitReq
          //     approve
          //     ? "card5"
          //     : "card2"
          //   : "card"
        } h-32 w-32 border-detail border cursor-pointer flex  flex-col items-center justify-center gap-1 rounded-3xl`}
      >
        <div className="flex items-center w-full justify-center gap-3 ">
          <div className="border border-detail/50 box w-[30%] text-2xl font-sans text-detail leading-8 h-8 flex items-center justify-center rounded-xl">
            {dis}
          </div>
          <div className="border border-detail/50 box w-[45%] text-2xl font-sans text-detail leading-8 h-8 flex items-center justify-center rounded-xl">
            {num}
          </div>
        </div>
        <div className=" flex items-center gap-1 w-full justify-center flex-col">
          {/* <img
            src="../../../public/static/images/gasoline.png"
            className="w-16 mt-auto"
            alt=""
          /> */}
          <div className="border border-detail/50 box w-[86%] text-2xl font-sans text-detail leading-8 h-8 flex items-center justify-center rounded-xl">
            {liter}
          </div>
          <div className="border border-detail/50 box w-[86%] text-2xl font-sans text-detail leading-8 h-8 flex items-center justify-center rounded-xl">
            {price}
          </div>
        </div>
      </motion.div>
      <Modal
        opened={opened}
        radius={20}
        size={1000}
        centered
        withCloseButton={false}
      >
        <div className="flex border-b mb-4 border-gray-300 pb-3 items-end">
          <div className="text-2xl select-none text-text font-semibold font-sans">
            Nozzle {obj.nozzle_no} Information
          </div>
          <div
            onClick={() => {
              setReadyState(false), setIsClosed(true), close();
            }}
            className="w-12 h-12 rounded-full ms-auto  bg-danger text-secondary hover:border-2 border-2 border-danger hover:border-danger duration-100 hover:bg-transparent hover:text-danger flex items-center justify-center"
          >
            <ImCross />
          </div>
        </div>
        {readyState ? (
          <ReadyState
            setNopermit={setNopermit}
            obj={obj}
            handlePermit={handlePermit1}
            setPremitFormInfo={setPremitFormInfo}
            setReadyStateObj={setReadyStateObj}
            selectedItem={readyState}
            onSelectedItem={(item) => setReadyState(item.label)}
            handleReadyState={handleReadyState}
            chooseOne={chooseOne}
            handleReadyPermit={handleReadyPermit}
            presetButtonDisable={presetButtonDisable}
          />
        ) : isErrorCon ? (
          <ErrorForms
            errorUpdate={errorUpdate}
            realTimeEdit={realTimeEdit}
            handleBack={handleBack}
            printFormInfo={printFormInfo}
            saleLiter={saleLiter}
            setSaleLiter={setSaleLiter}
            salePrice={salePrice}
            setSalePrice={setSalePrice}
            handleUpdate={handleUpdate}
            setManagerPassword={setManagerPassword}
            setManagerUserName={setManagerUserName}
            managerPassword={managerPassword}
            managerUserName={managerUserName}
            errorPermission={errorPermission}
          />
        ) : !isPermit ? (
          <RealTimeForms
            close={close}
            setPermitState={setPermitState}
            vocNumber={vocNumber}
            permitState={permitState}
            handlePermit={handlePermit}
            setPremitFormInfo={setPremitFormInfo}
            chooseOne={chooseOne}
            permitButtonDisable={permitButtonDisable}
          />
        ) : (
          <RealTimeCounting
            obj={obj}
            liter={liter}
            price={price}
            fetchObj={fetchObj}
            setSaleLiter={setSaleLiter}
            setSalePrice={setSalePrice}
            printFormInfo={printFormInfo}
            setPrintFormInfo={setPrintFormInfo}
            handlePrint={handlePrint}
            handleErrorCon={handleErrorCon}
            nozzle1FuelDetail={nozzle1FuelDetail}
            final={final}
            setRealTimeEdit={setRealTimeEdit}
            handleRealTimeUpdate={handleRealTimeUpdate}
            realTimeEditChooseOne={realTimeEditChooseOne}
          />
        )}
      </Modal>
    </>
  );
};

export default Card;
