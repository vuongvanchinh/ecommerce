import React from "react";
import { Link } from "react-router-dom";
// import { useSelector } from "react-redux";
import statusCards from "../assets/JsonData/status-card-data.json";
import StatusCard from "../components/status-card/StatusCard";
import Table from "../components/table/Table.jsx";
import Badge from "../components/badge/Badge";
// import TextField from "../components/form/textfield/TextField";
// import TextEditor from "../components/form/texteditor/TextEditor";
// import SelectField from "../components/form/selectfield/SelectField";
// import Loader from "../components/loader/Loader";
// import SelectImageItem from "../components/form/selectimage/selectImageItem/SelectImageItem";
// import user_image from '../assets/images/chinh.jpg';
// import Checkbox from "../components/form/checkbox/Checkbox";
// import TableExtra from "../components/table/TableExtra";
// import Quote from "../components/quote/Quote";
import Timeline from "../components/timeline/Timeline";
const topCustomers = {
  head: ["user", "total orders", "total spending"],
  body: [
    {
      username: "john joe",
      order: "490",
      spice: "$15.972",
    },
    {
      username: "john joe",
      order: "490",
      spice: "$15.972",
    },
    {
      username: "john joe",
      order: "490",
      spice: "$15.972",
    },
    {
      username: "john joe",
      order: "490",
      spice: "$15.972",
    },
    {
      username: "frank iva",
      order: "250",
      spice: "$12.972",
    },
    {
      username: "john joe",
      order: "120",
      spice: "$10.25",
    },
    {
      username: "john joe",
      order: "110",
      spice: "$8.65",
    },
  ],
};

const renderCustomerHead = (item, index) => <th key={index}>{item}</th>;

const renderCustomerBody = (item, index) => (
  <tr key={index}>
    <td>{item.username}</td>
    <td>{item.order}</td>
    <td>{item.spice}</td>
  </tr>
);

const lateOrders = {
  head: ["order id", "user", "total price", "date", "status"],

  body: [
    {
      id: "#0D1711",
      user: "john doe",
      date: "17 Jun 2021",
      price: "$900",
      status: "shipping",
    },
    {
      id: "#OD1712",
      user: "frank iva",
      date: "1 Jun 2021",
      price: "$400",
      status: "paid",
    },
    {
      id: "#OD1713",
      user: "anthony baker",
      date: "27 Jun 2021",
      price: "$200",
      status: "pending",
    },
    {
      id: "#OD1712",
      user: "frank iva",
      date: "1 Jun 2021",
      price: "$400",
      status: "paid",
    },
    {
      id: "#OD1713",
      user: "anthony baker",
      date: "27 Jun 2021",
      price: "$200",
      status: "refund",
    },
  ],
};

const orderStatus = {
  shipping: "primary",
  pending: "warning",
  paid: "success",
  refund: "danger",
};

const renderOrderHead = (item, index) => <th key={index}>{item}</th>;

const renderOrderBody = (item, index) => (
  <tr key={index}>
    <td>{item.id}</td>
    <td>{item.user}</td>
    <td>{item.price}</td>
    <td>{item.date}</td>
    <td>
      <Badge type={orderStatus[item.status]} content={item.status} />
    </td>
  </tr>
);
const Dashboard = () => {
  const onChange = (item) => {
    console.log(item);
  };
  return (
    <div>
      <h2 className="page-header">Dashboard</h2>
      <div className="row section">
        <div className="col-md-12 col-6 margin-bottom-1rem">
          <div className="grid grid-col-2 grid-col-md-2 grid-col-sm-1 padding_0">
            {statusCards.map((item, index) => (
              <StatusCard
                key={index}
                icon={item.icon}
                count={item.count}
                title={item.title}
              />
            ))}
          </div>
        </div>
        <div className="col-md-12 col-6 margin-bottom-1rem"></div>
        <div className="col-md-12 col-4 margin-bottom-1rem">
          <div className="card">
            <div className="card__header">
              <h3>Top customers</h3>
            </div>
            <div className="card__body">
              <Table
                limit={3}
                headData={topCustomers.head}
                renderHead={(item, index) => renderCustomerHead(item, index)}
                bodyData={topCustomers.body}
                renderBody={(item, index) => renderCustomerBody(item, index)}
              />
            </div>
          </div>
        </div>
        <div className="col-md-12 col-8 margin-bottom-1rem">
          <div className="card">
            <div className="card__header">
              <h3>Latest orders</h3>
            </div>
            <div className="card__body">
              <Table
                headData={lateOrders.head}
                renderHead={(item, index) => renderOrderHead(item, index)}
                bodyData={lateOrders.body}
                renderBody={(item, index) => renderOrderBody(item, index)}
              />
            </div>
            <div className="card__footer">
              <Link to="/">view all</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
