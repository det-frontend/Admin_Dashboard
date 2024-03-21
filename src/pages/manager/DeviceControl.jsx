import React, { useContext, useEffect, useRef, useState } from "react";
import Card from "../../components/device/Card";
import UseGet from "../../api/hooks/UseGet";
import useTokenStorage from "../../utils/useDecrypt";
import mqtt from "mqtt";
import LoadContext from "../../services/LoadContext";
import LoaderCom from "../../components/LoaderCom";
import Re from "../../services/Re";
const DeviceControl = () => {
  const { loading, setLoading } = useContext(LoadContext);
  const client = mqtt.connect("ws://detpos:asdffdsa@192.168.0.100:9001");
  const { reFresh, setReFresh } = useContext(Re);

  const [token, setToken] = useState("none");

  const [{ data_g, loading_g, error_g, pagi_g }, fetchItGet] = UseGet();

  useEffect(() => {
    fetchItGet(`/device`, token);
  }, []);

  const { loadToken } = useTokenStorage();
  useEffect(() => {
    const token = loadToken();
    if (token) {
      setToken(token);
    }
  }, []);

  const [noMorePermit, setNoMorePermit] = useState(null);
  const [payloadHistory, setPayloadHistory] = useState([]);
  const payloadHistoryRef = useRef(payloadHistory);
  const [allDone, setAllDone] = useState("0");
  const [permitd, setPermitd] = useState(false);
  const [readyDespenserHistory, setReadyDespenserHistory] = useState([]);
  const readyDespenserHistoryRef = useRef(readyDespenserHistory);
  const [liveDespenserHistory, setLiveDespenserHistory] = useState([]);
  const liveDespenserHistoryRef = useRef(liveDespenserHistory);
  const [finalData, setFinalData] = useState(0);
  const [nozzle1PermitRecord, setNozzle1PermitRecord] = useState(0);
  const checkLiveRef = useRef({
    nozzle: "",
  });
  const permitRef = useRef({
    nozzle: "",
  });
  const regex = /[A-Z]/g;
  const [liveData, setLiveData] = useState();
  const [liveDispenser, setLiveDispenser] = useState(undefined);

  const nozzle1FuelDetailRef = useRef({ liter: "", price: "" });

  client.on("connect", () => {
    client.subscribe("detpos/#", (err) => {
      err && console.log(err);
    });
  });

  const [permitData, setPermitData] = useState([]);
  const [approveData, setApproveData] = useState([]);

  // console.log("====================================");
  // console.log("permit req is", permitData, "and approve is ", approveData);
  // console.log("====================================");

  client.on("message", (topic, message) => {
    // message is Buffer
    // console.log(
    //   "topic is ---- (",
    //   topic,
    //   ") and message is (",
    //   message.toString(),
    //   ")"
    // );

    // console.log(message.toString(), "..................");

    if (topic.startsWith("detpos/device/permit/") && /[1-8]$/.test(topic)) {
      const prefix = message.toString().substring(0, 2); // "01"

      const topicCount = payloadHistoryRef.current.filter(
        (t) => t === parseInt(prefix)
      ).length;
      // if (topicCount < 2) {
      //   setPayloadHistory((prevTopics) => [...prevTopics, parseInt(prefix)]);
      // }
      // if (topicCount < 2) {
      // console.log(permitData.includes(parseInt(prefix)), "...............");
      if (!permitData.includes(parseInt(prefix))) {
        // Update state only if the prefix is not in permitData
        setPayloadHistory((prevTopics) => [...prevTopics, parseInt(prefix)]);
        setPermitData((prevData) => [...prevData, parseInt(prefix)]);
      }
      // }
      setNoMorePermit(e.nozzle);
    }

    if (topic === "detpos/local_server") {
      const prefix = message.toString().substring(0, 2); // "01"
      setAllDone(prefix);
      // setFetchNew((prev)=>!prev)
    }

    if (topic === "detpos/device/price") {
      // setPriceChange(true);
    }

    if (topic === "detpos/local_server/mode") {
      if (message.toString() === "allow") {
        setPermitd(true);
      } else if (message.toString() === "manual") {
        setPermitd(false);
      }
    }

    if (topic === "detpos/local_server/price_change") {
      // setPriceChange(true);
    }

    if (topic.startsWith("detpos/local_server") && /[1-8]$/.test(topic)) {
      const prefix = message.toString().substring(0, 2); // "01"

      const topicCount = readyDespenserHistoryRef.current.filter(
        (t) => t === parseInt(prefix)
      ).length;
      if (topicCount < 1) {
        setReadyDespenserHistory((prevTopics) => [
          ...prevTopics,
          parseInt(prefix),
        ]);
        setApproveData((prevData) => [...prevData, parseInt(prefix)]);
        setPermitData((prevData) =>
          prevData.filter((item) => item !== parseInt(prefix))
        );
      }
    }

    // console.log(message.toString())

    // console.log(message.toString(), topic);

    if (topic === "detpos/device/whreq") {
      const topicCount = liveDespenserHistoryRef.current.filter(
        (t) => t == message.toString()
      ).length;
      if (topicCount < 2) {
        setLiveDespenserHistory((prevTopics) => [
          ...prevTopics,
          message.toString(),
        ]);
      }
    }

    if (topic === "detpos/device/req") {
      const prefix = message.toString().substring(0, 2); // "01"
      const suffix = message.toString().substring(2); // "cancel"
      setPermitData((prevData) =>
        prevData.filter((item) => item !== parseInt(prefix))
      );

      setNoMorePermit(prefix);
    }

    if (topic.startsWith("detpos/device/Final/") && /[1-8]$/.test(topic)) {
      let data = message.toString().split(regex);
      setFinalData(data[0]);
      setReFresh(!reFresh);
    }

    // if (topic.startsWith("detpos/device/livedata/") && /[1-8]$/.test(topic)) {
    //   let data = message.toString().split(regex);
    //   const updatedNozzle1FuelDetail = {
    //     liter: data[1],
    //     price: data[2],
    //     nozzleNo: data[0],
    //   };

    //   const checkLive = {
    //     nozzleNo: data[0],
    //   };

    //   checkLiveRef.current = {
    //     ...checkLiveRef.current,
    //     ...checkLive,
    //   };

    //   nozzle1FuelDetailRef.current = {
    //     ...nozzle1FuelDetailRef.current,
    //     ...updatedNozzle1FuelDetail,
    //   };
    // }
    // client.end();
  });

  // console.log(data_g.map((e) => parseInt(e.nozzle_no)));

  // console.log(
  //   reFresh,
  //   "gggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg"
  // );

  return (
    <>
      {loading && <LoaderCom />}
      <div className="flex items-center h-full">
        <div className="w-full flex gap-8 flex-wrap items-center justify-center">
          {data_g?.map((obj, index) => (
            <Card
              Client={client}
              permitReq={permitData.includes(parseInt(obj.nozzle_no))}
              ///upper is my update
              loading
              setloading
              // setFetchNew={setFetchNew} need
              nozzle1PermitRecord={nozzle1PermitRecord}
              setNozzle1PermitRecord={setNozzle1PermitRecord}
              // selectedCards={selectedCards} no need in card
              // setSelectedCards={setSelectedCards} no need in card
              payloadHistory={payloadHistory}
              setPayloadHistory={setPayloadHistory}
              title={obj.nozzle_no}
              nozzle1FuelDetail={nozzle1FuelDetailRef}
              obj={obj}
              id={index}
              active={payloadHistory.includes(parseInt(obj.nozzle_no))}
              // setVisible={setVisible} no need in card
              key={index}
              finalData={finalData}
              setFinalData={setFinalData}
              onClick={() => open()}
              noMorePermit={noMorePermit}
              permitOfNozzles={permitRef}
              allDone={allDone}
              liveData={liveData == obj.nozzle_no ? liveData : undefined}
              setLiveData={setLiveData}
              setAllDone={setAllDone}
              checkLiveRef={checkLiveRef}
              liveDispenser={liveDispenser}
              approve={readyDespenserHistory.includes(parseInt(obj.nozzle_no))}
              setApprove={setReadyDespenserHistory}
              liveDespenserHistory={liveDespenserHistory.includes(obj.dep_no)}
              dis={obj.dep_no}
              num={obj.nozzle_no}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default DeviceControl;
