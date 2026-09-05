import React, { useState } from "react";
import "./AddProductModal.css";
import SearchField from "./SearchField";

const AddProductModal = ({ handleClose, showAddProd }) => {
  const showHideClassName = showAddProd
    ? "modal AddProdModal display-block"
    : "modal AddProdModal display-none";
  const [resetfield, setResetfield] = useState(false);
  const [newProduct, setNewProduct] = useState();
  const [newProductData, setNewProductData] = useState();
  const handleProdname = (id1, name1) => {
    setNewProduct({
      ...newProduct,
      prodName: name1,
    });
    setNewProductData({
      ...newProductData,
      prodName: id1,
    });
  };
  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        <h2>Add Product</h2>
        <p>
          Before adding a new product please make sure the product does not
          exist yet with a different name. Double adding an already existing
          product will severely confuse analysis statistics.
        </p>
        <form className="addproduct-form" action="">
          <section className="addprod-1">
            <h3>Step 1:</h3>
            <div className="form-group">
              <label htmlFor="">Select Product Name:</label>
              <SearchField
                className="searchfield"
                searchURL={"/prodnames"}
                searchID={"prodNameID"}
                searchName={"abbreviation"}
                resetfield={resetfield}
                setResetfield={setResetfield}
                setProdSupplier={handleProdname}
              />
            </div>
            <div className="addnewprodline">
              <p>Or</p>
              <button>Add New Product Name</button>
            </div>
          </section>
          <section className="addprod-2"></section>
          <section className="addprod-3">
            <button onClick={handleClose}>Close</button>
          </section>
        </form>
      </section>
    </div>
  );
};

export default AddProductModal;
