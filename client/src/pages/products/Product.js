import React, { useEffect } from "react";
import { axiosClient } from "../../utils/axiosClient";

function Product() {
  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const response = await axiosClient.get("/products/all");
    console.log("got the response: ", response?.data);
  }
  return <div>Products</div>;
}

export default Product;
