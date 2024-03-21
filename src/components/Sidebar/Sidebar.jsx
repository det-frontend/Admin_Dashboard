import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaCaretLeft } from "react-icons/fa6";
import { MdAccountCircle } from "react-icons/md";
import { TbCoinFilled } from "react-icons/tb";
import { BsInboxesFill } from "react-icons/bs";
import { GiFuelTank } from "react-icons/gi";
import { FaChartBar } from "react-icons/fa";
import { FaChartPie } from "react-icons/fa6";
import { FaPlusCircle } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { BiLogOutCircle } from "react-icons/bi";
import { IoFileTrayFull } from "react-icons/io5";
import { MdPropaneTank } from "react-icons/md";
import { IoMdPricetag } from "react-icons/io";
import { BsFillFuelPumpFill } from "react-icons/bs";
import { MdSpaceDashboard } from "react-icons/md";
import { FaCashRegister } from "react-icons/fa6";
import useTokenStorage from "../../utils/useDecrypt";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../services/AuthContext";
import { MdOutlineControlCamera } from "react-icons/md";
import ConAlert from "../alert/ConAlert";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Button } from "@mantine/core";
import { ImCross } from "react-icons/im";
import TextInput from "../inputbox/TextInput";
import ErrorAlert from "../alert/ErrorAlert";
import Alert from "../alert/Alert";
import Re from "../../services/Re";

const Sidebar = () => {
  const navigate = useNavigate();
  const { clearToken } = useTokenStorage();
  const [phone1, setPhone1] = useState();
  const [phone2, setPhone2] = useState();
  const [location, setLocation] = useState();

  const [isInstalling, setIsInstalling] = useState();
  const { isAuth, setIsAuth } = useContext(AuthContext);
  const { t, i18n } = useTranslation();
  const [opened, { open, close }] = useDisclosure(false);

  const ins = i18n.store.data.en.translation.SIDE_INSTALLER;
  const manag = i18n.store.data.en.translation.SIDE_MANAGER;

  useEffect(() => {
    const check = JSON.parse(localStorage.getItem("installed"));
    if (check) {
      setIsInstalling(true);
    } else {
      setIsInstalling(false);
    }
  }, [isAuth]);

  // const [data, setData] = useState(i18n.store.data.en.translation.SIDE_MANAGER);
  //   console.log(t("SIDE"));
  // const data = i18n.store.data.en.translation.SIDE_MANAGER;
  // console.log(data);
  const managerIcon = [
    <MdAccountCircle />,
    <MdOutlineControlCamera />,
    <TbCoinFilled />,
    <IoFileTrayFull />,
    <MdPropaneTank />,
    <FaChartBar />,
    <FaChartPie />,
    <FaPlusCircle />,
    <IoMdPricetag />,
  ];
  const installerIcon = [
    <MdSpaceDashboard />,
    <BsFillFuelPumpFill />,
    <GiFuelTank />,
    <MdPropaneTank />,
    <MdAccountCircle />,
    <FaCashRegister />,
    <FaPlusCircle />,
  ];
  const [isBouncing, setBouncing] = useState(true);
  const [re, setRe] = useState(false);
  const { reFresh, setReFresh } = useContext(Re);

  const [data, setData] = useState();

  useEffect(() => {
    const interval = setInterval(() => {
      setBouncing((prev) => !prev);
    }, 180000); // 180000 3 minutes in milliseconds

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const pfp = {
    open: { x: 0, opacity: 1 },
    close: { x: "-100px", opacity: 0 },
  };
  const pfp2 = {
    open: { x: 80, opacity: 1 },
    close: { x: 0, opacity: 0 },
  };
  const bg = {
    open: { x: 160, opacity: 1 },
    close: { x: 0, opacity: 1 },
  };
  const [state, setState] = useState();

  const handleClick = () => {
    const obj = {
      station: location,
      phone1: phone1,
      phone2: phone2,
    };

    const data = JSON.stringify(obj);
    localStorage.setItem("data", data);

    setRe(!re),
      setLocation(""),
      setReFresh(!reFresh),
      setPhone1(""),
      setPhone2(""),
      close();

    // setState(!state);
  };
  useEffect(() => {
    const dd = JSON.parse(localStorage.getItem("data"));
    setData(dd);
  }, [re]);

  return (
    <>
      <motion.div
        onMouseEnter={() => {
          setState(true);
        }}
        onMouseLeave={() => {
          setState(false);
        }}
        transition={{
          duration: 0.7,
          type: "spring",
          bounce: 0.35,
          mass: 0.5,
          damping: 12,
        }}
        animate={state ? "open" : "close"}
        variants={bg}
        className="absolute z-50 w-[250px] shadow-xl shadow-shadow/20 ml-[-160px] side_bg h-screen"
      >
        <motion.div
          onClick={() => open()}
          animate={state ? "open" : "close"}
          variants={pfp2}
          transition={{ duration: 0.2, type: "tween" }}
          className="bg-secondary cursor-pointer mx-auto rounded-lg ml-[-35px] pt-3 w-[150px] h-[150px] mt-5"
        >
          <div className="bg-[#69eccf] w-24 h-24 mx-auto overflow-hidden flex items-center justify-center rounded-full">
            <img
              src="../../../static/images/manager(2).png"
              alt=""
              className="w-[80%] mb-[-20px]"
            />
          </div>
          <div className="mt-1 text-[#69eccf] text-lg font-semibold text-center">
            Manager{" "}
          </div>
        </motion.div>
        <motion.div
          animate={state ? "open" : "close"}
          variants={pfp2}
          transition={{ duration: 0.2, type: "tween" }}
          className=" mx-auto rounded-lg ml-[-73px] w-[220px]  mt-5"
        >
          <div className="flex scroll_bar_right pl-3 gap-y-2 h-[62vh] overflow-y-scroll flex-col">
            {(isInstalling ? ins : manag).map((e, index) => (
              <NavLink
                key={index}
                onClick={() => setState(false)}
                to={e.link}
                className="py-4 scroll_bar_left flex gap-3 duration-150 items-center text-gray-600 px-4 group rounded-md hover:bg-secondary"
              >
                <div className="text-2xl duration-150 group-hover:text-detail">
                  {isInstalling ? installerIcon[index] : managerIcon[index]}
                </div>
                <div className=" text-xl duration-150 group-hover:text-detail ">
                  {e.name}
                </div>
              </NavLink>
            ))}
          </div>
        </motion.div>
        <motion.div
          onClick={() => setState(true)}
          animate={!state ? "open" : "close"}
          variants={pfp}
          className={`bg-secondary animate-duration-[360ms] ${
            isBouncing ? "animate-shake" : ""
          }  animate-twice border-2 border-[#D0F0E9] justify-center  items-center top-[50%] flex absolute ms-4 left-[200px] w-14 h-14 rounded-full`}
        >
          <FaCaretLeft className="text-xl text-[#69eccf]" />
        </motion.div>
        <motion.button
          animate={state ? "open" : "close"}
          variants={pfp2}
          onClick={ConAlert("Logout from Account ?", true, () => {
            clearToken(),
              localStorage.setItem("installed", false),
              navigate("/login");
          })}
          // onClick={() => {
          //   clearToken(),
          //     localStorage.setItem("installed", false),
          //     navigate("/login");
          // }}
          transition={{ duration: 0.2, type: "tween" }}
          className="bg-secondary hover:border active:border-0 text-lg cursor-pointer gap-4 text-danger border-danger mb-4 ml-[-55px] justify-center items-center flex left-0 absolute bottom-0 w-[200px] h-12 rounded-lg"
        >
          <BiLogOutCircle /> LOG OUT
        </motion.button>
      </motion.div>
      <div className="">
        <motion.div
          animate={!state ? "open" : "close"}
          variants={pfp}
          transition={{ duration: 0.2, type: "tween" }}
          className="bg-[#69eccf] z-50 mt-4 overflow-hidden justify-center items-center flex fixed left-3 w-16 h-16 rounded-lg"
        >
          {/* <MdAccountCircle /> */}
          <img
            src="../../../public/static/images/manager(2).png"
            alt=""
            className="w-[80%] mb-[-12px]"
          />
        </motion.div>
      </div>
      <Modal
        opened={opened}
        radius={20}
        size={1000}
        centered
        withCloseButton={false}
      >
        <div className="flex border-b mb-4 border-gray-300 pb-3 items-end">
          <div className="text-2xl ms-4 select-none text-text font-semibold font-sans">
            Station Information
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
            <div className="">
              <div className="text-xl mb-3 ms-2 font-semibold text-gray-600">
                {" "}
                {data?.station}
              </div>
              <TextInput
                style="!w-[300px]"
                label="Station "
                placeholder="Station "
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="">
              <div className="text-xl mb-3 ms-2 font-semibold text-gray-600">
                {" "}
                {data?.phone1}
              </div>
              <TextInput
                style="!w-[300px]"
                label="Phone Number"
                placeholder="Phone Number"
                value={phone1}
                onChange={(e) => setPhone1(e.target.value)}
              />
            </div>
            <div className="">
              <div className="text-xl mb-3  ms-2 font-semibold text-gray-600">
                {" "}
                {data?.phone2}
              </div>
              <TextInput
                style="!w-[300px]"
                label="Phone Number"
                placeholder="Phone Number"
                value={phone2}
                onChange={(e) => setPhone2(e.target.value)}
              />
            </div>
          </div>
          <button
            // onClick={() =>
            //   Alert(
            //     "Are you sure ?",
            //     handleClick(),
            //     setRe(!re),
            //     setLocation(""),
            //     setPhone1(""),
            //     setPhone2("")
            //   )
            // }
            onClick={
              location !== "" && phone1 !== "" && phone2 !== ""
                ? Alert("Are you sure ?", handleClick)
                : () => ErrorAlert("Some Fields are Empty")
            }
            className={`w-[300px] ml-auto mt-4  text-secondary  items-center justify-center gap-3 flex  font-mono text-xl active:scale-95 duration-100 bg-[#38b59e] h-[56px] rounded-md`}
          >
            Update
          </button>
        </div>
      </Modal>
    </>
  );
};

export default Sidebar;
